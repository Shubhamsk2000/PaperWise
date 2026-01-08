import { useParams } from "react-router-dom"

const Workspace = () => {
  const { workspaceId } = useParams();
  return (
    <div className="px-(--x-padding) pt-(--navbar-h) ">
      Workspace with id{workspaceId}
    </div>
  )
}

export default Workspace