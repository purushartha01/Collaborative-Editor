import EditorContainer from "../components/EditorContainer"
import MenuBar from "../components/MenuBar"


const PageLayout = () => {
  return (
    <div className="h-screen w-screen grid grid-rows-[80px_1fr] grid-cols-1">
      <MenuBar />
      <EditorContainer />
    </div>
  )
}

export default PageLayout