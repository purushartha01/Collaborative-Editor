import { Outlet } from "react-router-dom"
import VerticalMenubar from "../components/VerticalMenubar"


const PageLayout = () => {
  return (
    <div className="h-screen w-screen">
      <VerticalMenubar>
        <Outlet />
      </VerticalMenubar>
    </div>
  )
}

export default PageLayout