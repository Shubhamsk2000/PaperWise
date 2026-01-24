import { useParams } from "react-router-dom";
import AddSources from "../components/AddSources";
import Conversation from "../components/Conversation";
import { useState } from 'react';

const Workspace = () => {
  const { workspaceId } = useParams();
  const [activePdfs, setActivePdfs] = useState([]);

  return (
    <div className="px-(--x-padding) pt-(--navbar-h) h-full pb-4 flex gap-4">
      <AddSources
        workspaceId={workspaceId}
        activePdfs={activePdfs}
        setActivePdfs={setActivePdfs}
      />
      <Conversation workspaceId={workspaceId} sourcesLen={activePdfs.length}/>
    </div>
  );
};

export default Workspace;
