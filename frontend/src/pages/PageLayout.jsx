import { Outlet } from "react-router-dom"
import MenuBar from "../components/MenuBar"


const PageLayout = () => {
  return (
    <div className="h-screen w-screen grid grid-rows-[80px_1fr] grid-cols-1">
      <MenuBar />
      <Outlet />
    </div>
  )
}

export default PageLayout