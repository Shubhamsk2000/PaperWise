import { useState } from 'react';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Eye, EyeOff } from 'lucide-react';
import abstractImg from '../assets/abstract.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordVisible = () => {
    setIsVisible(prev => !prev);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validEmail = email.trim();
      let response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: validEmail,
          password: password
        })
      });
      response = await response.json();

      if (response.status === "success") {
        login(response.data, response.token);
        toast.success(`Welcome back! ${response.data.userName}`);
        navigate('/me');
      }
      else {
        toast.error(response.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Network error. Please try again");
      console.error("Login Error:", error);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex h-full'>

      <div className="w-2/5 justify-center items-center  md:flex hidden"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.8)), url(${abstractImg}) no-repeat center / cover`,
        }}>
      </div>

      <div className="md:w-3/5 flex justify-center items-center  w-full">
        <form className="flex flex-col min-w-80 w-130 justify-start p-4" onSubmit={handleSubmit}>
          <h2 className="text-3xl text-start text-[#cbcbcb] my-8 font-medium text-shadow-[0_0_40px_#000]" >Login</h2>
          <label className="mb-2 text-[#969696]" htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            className="p-2 mb-4 border-[#363636] border-2 rounded-md outline-0 bg-[#0d0d0d]"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="mb-2 text-[#969696]" htmlFor="password">Password</label>
          <div className=' flex relative justify-center items-center mb-4'>
            <input
              type={`${isVisible ? "text" : "password"}`}
              id="password"
              className="w-full p-2 border-[#363636] border-2 rounded-md outline-0 bg-[#0d0d0d] "
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />
            <span className='absolute right-4 cursor-pointer' onClick={handlePasswordVisible}>{isVisible ? <EyeOff /> : <Eye />}</span>
          </div>
          <button
            type="submit"
            className={`p-2 mt-2 rounded transition text-black font-medium text-lg ${loading ? 'bg-[#8a8a8a] cursor-wait': 'bg-white cursor-pointer'} `}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>

    </div>
  )
}

export default Login;