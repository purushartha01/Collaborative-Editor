import { LoginSignupIcon, NewFileIcon, OpenFileIcon, SaveFileIcon, SettingsIcon, ShareIcon } from "./Icons"

const MenuItems = () => {
  const menuIconStyle = "h-8 aspect-square"
  const menuItems = [
    {
      name: "New File",
      icon: <NewFileIcon className={menuIconStyle} />,
      action: () => { },
      isActive: true
    },
    {
      name: "Open File",
      icon: <OpenFileIcon className={menuIconStyle} />,
      action: () => { },
      isActive: true
    },
    {
      name: "Save File",
      icon: <SaveFileIcon className={menuIconStyle} />,
      action: () => { },
      isActive: true
    },
    {
      name: "",
      icon: <></>,
      action: () => { },
      isActive: false
    },
    {
      name: "",
      icon: <></>,
      action: () => { },
      isActive: false
    },
    {
      name: "",
      icon: <></>,
      action: () => { },
      isActive: false
    },
    {
      name: "",
      icon: <></>,
      action: () => { },
      isActive: false
    }, {
      name: "",
      icon: <></>,
      action: () => { },
      isActive: false
    }, {
      name: "",
      icon: <></>,
      action: () => { },
      isActive: false
    },
    {
      name: "Share",
      icon: <ShareIcon className={menuIconStyle} />,
      action: () => { },
      isActive: true
    },
    {
      name: "Settings",
      icon: <SettingsIcon className={menuIconStyle} />,
      action: () => { },
      isActive: true
    }
    , {
      name: "Login/Signup",
      icon: <LoginSignupIcon className={menuIconStyle} />,
      action: () => { },
      isActive: true
    }
  ]

  return <div className="h-full w-full grid grid-rows-1 grid-cols-12 gap-1 px-2 ">
    {menuItems.map((item, index) => {
      return <button key={index} className={`grid grid-rows-2 py-2 max-w-full menu-item`} disabled={!item.isActive}>
        <span onClick={item.action} className="row-span-1 flex justify-center items-center">
          {item.icon}
        </span>
        <span className="text-sm row-start-2 row-span-1 text-center">{item.name}</span>
      </button>
    })}
  </div>
}


const MenuBar = () => {
  return (
    <div className="menu-bar">
      <MenuItems />
    </div>
  )
}

export default MenuBar