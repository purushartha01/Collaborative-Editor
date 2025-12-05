import { useEffect, useRef, useState } from "react"
import { LoginSignupIcon, NewFileIcon, OpenFileIcon, SaveFileIcon, SettingsIcon, ShareIcon } from "./Icons"
import Portal from "./PortalContainer"
import NewFile from "./NewFile";
import OpenFile from './OpenFile';
import SaveFile from './SaveFile';
import ShareFile from './ShareFile';
import LoginSignup from './LoginSignup';

const MenuItems = () => {

  const [isPortalVisible, setIsPortalVisible] = useState(false);
  const [activePortalContent, setActivePortalContent] = useState(null);


  // TODO: To Ensure portal visibility when opening via url params, can render the portalContent via a functional Component that can also control the activePortalContent State

  const closePortal = () => {
    setIsPortalVisible(false);
  }

  const menuIconStyle = "h-8 aspect-square"
  const menuItems = [
    {
      name: "New",
      icon: <NewFileIcon className={menuIconStyle} />,
      isActive: true,
      needsDropdown: true,
      portalContent: <NewFile closePortal={closePortal} />,
    },
    {
      name: "Open",
      icon: <OpenFileIcon className={menuIconStyle} />,
      isActive: true,
      needsDropdown: true,
      portalContent: <OpenFile closePortal={closePortal} />,
    },
    {
      name: "Save",
      isActive: true,
      needsDropdown: true,
      portalContent: <SaveFile closePortal={closePortal} />,
      icon: <SaveFileIcon className={menuIconStyle} />,
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
      isActive: true,
      needsDropdown: true,
      portalContent: <ShareFile closePortal={closePortal} />,
    },
    {
      name: "Settings",
      icon: <SettingsIcon className={menuIconStyle} />,
      isActive: true,
      needsDropdown: false,
      portalContent: <div className="p-4">Settings Dropdown Content</div>,
    }
    , {
      name: "Login",
      icon: <LoginSignupIcon className={menuIconStyle} />,
      isActive: true,
      needsDropdown: true,
      portalContent: <LoginSignup closePortal={closePortal} />,
    }
  ]

  console.log(activePortalContent);

  const dropdownRef = useRef(null);

  return <div className="h-full w-full grid grid-rows-1 grid-cols-12 gap-1 px-2 ">
    {menuItems.map((item, index) => {
      return <button key={index} className={`grid grid-rows-2 py-2 max-w-full menu-item button`} disabled={!item.isActive} onClick={(e) => {
        e.preventDefault();
        setIsPortalVisible(item.needsDropdown ? true : false);
        setActivePortalContent(item.portalContent);
      }}>
        <span onClick={item.action} className="row-span-1 flex justify-center items-center">
          {item.icon}
        </span>
        <span className="text-sm row-start-2 row-span-1 text-center">{item.name}</span>
      </button>

    })}
    {
      isPortalVisible && <Portal closePortal={closePortal}>
        <div ref={dropdownRef} className="text-black h-full w-full p-4">
          {activePortalContent}
        </div>
      </Portal>
    }
  </div >
}


const MenuBar = () => {
  return (
    <div className="menu-bar">
      <MenuItems />
    </div>
  )
}

export default MenuBar