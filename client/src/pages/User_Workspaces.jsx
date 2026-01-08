import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Plus } from 'lucide-react';

const User_Workspaces = () => {
  const [workSpaces, setWorkSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt-token');

    const fetchWorkspaces = async (token) => {
      setIsLoading(true);
      try {
        let response = await fetch(`${import.meta.env.VITE_SERVER_URL}/workspaces`, {
          headers: {
            "authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          logout();
          return;
        }

        response = await response.json();

        if (!response.ok && response.status === "fail") {
          throw new Error();
        }

        setWorkSpaces(response.workspaces);

      } catch (error) {
        toast.error("Something wend wrong. Refresh the page");
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && token) {
      fetchWorkspaces(token);
    } else {
      setIsLoading(false);
    }

  }, [user]);

  const handleCreateWorkspace = async () => {
    try {
      let response = await fetch(`${import.meta.env.VITE_SERVER_URL}/workspaces`, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${localStorage.getItem('jwt-token')}`
        }
      });
      response = await response.json();

      if (response.status === "success") {
        toast.success(response.message);
        navigate(`/workspaces/${response.workspaceId}`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="px-(--x-padding) pt-(--navbar-h) w-full h-full relative">
      {isLoading ? (

        <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center text-4xl gap-4">
          <Loader className="size-10 animate-[spin_2.5s_linear_infinite]" />
          <span>Loading your Workspaces</span>
        </div>

      ) : (
        <div className="mx-16">
          <div>
            <h1 className="text-6xl font-semibold my-16  text-shadow-[0_0_50px_#000]">Welcome to PaperWise, {user.userName}</h1>
            <h3 className="text-2xl text-[#cbcbcb] mb-8">Recent Workspaces</h3>
          </div>

          <div className="flex gap-8 scroll-smooth overflow-auto flex-nowrap no-scrollbar snap-center">
            <div
              onClick={handleCreateWorkspace}
              className="cursor-pointer border-[#686868] border-2 rounded-lg flex flex-col justify-center items-center h-60 w-80 shrink-0 gap-8"
            >
              <div className=" p-4 rounded-full bg-(--primary-bg)">
                <Plus className="size-8 text-[#b2b2b2]" />
              </div>
              <p className="text-2xl text-center">Create new workspace</p>
            </div>

            {workSpaces.length > 0 && workSpaces.map((workspace) => (
              <Link
                to={`/workspaces/${workspace._id}`}
                key={workspace._id}
                className="p-4 rounded-lg border border-white/10 h-60 w-80 shrink-0"
                style={{ backgroundColor: 'var(--secondary-bg)' }}
              >
                {workspace.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default User_Workspaces;