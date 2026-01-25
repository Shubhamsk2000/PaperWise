import { useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import AddSources from '../components/AddSources.jsx';
const Conversation = lazy(() => import("../components/Conversation.jsx"));

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

      <Suspense fallback={<div>Loading...</div>}>
        <Conversation workspaceId={workspaceId} activePdfs={activePdfs} />
      </Suspense>
    </div >
  );
};

export default Workspace;
