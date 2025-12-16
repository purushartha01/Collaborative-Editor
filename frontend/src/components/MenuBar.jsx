import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { LoginSignupIcon, NewFileIcon, OpenFileIcon, SaveFileIcon, SettingsIcon, ShareIcon, UserIcon } from "./Icons"
import Portal from "./PortalContainer"
import NewFile from "./NewFile";
import OpenFile from './OpenFile';
import SaveFile from './SaveFile';
import ShareFile from './ShareFile';
import LoginSignup from './LoginSignup';
import { useNavigate } from 'react-router-dom';
import authStore from "../stores/authStore";

const MenuItems = () => {

  const [isPortalVisible, setIsPortalVisible] = useState(false);
  const [activePortalContent, setActivePortalContent] = useState(null);

  const user = authStore((s) => s.user);
  const navigate = useNavigate();

  // TODO: To Ensure portal visibility when opening via url params, can render the portalContent via a functional Component that can also control the activePortalContent State

  const closePortal = () => {
    setIsPortalVisible(false);
    setActivePortalContent(null);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    hashParams.delete('openPortal');
    const newHash = hashParams.toString();
    window.location.hash = newHash ? `#${newHash}` : '';
  }

  const menuIconStyle = "h-8 aspect-square";
  const disabledMenuIconStyle = "h-8 aspect-square text-gray-400";
  const menuItems = useMemo(() => [
    {
      name: "New",
      icon: <NewFileIcon className={user ? menuIconStyle : disabledMenuIconStyle} />,
      isActive: !!user,
      needsDropdown: true,
      portalContent: <NewFile closePortal={closePortal} />,
    },
    {
      name: "Open",
      icon: <OpenFileIcon className={user ? menuIconStyle : disabledMenuIconStyle} />,
      isActive: !!user,
      needsDropdown: true,
      portalContent: <OpenFile closePortal={closePortal} />,
    },
    {
      name: "Save",
      isActive: !!user,
      needsDropdown: true,
      portalContent: <SaveFile closePortal={closePortal} />,
      icon: <SaveFileIcon className={user ? menuIconStyle : disabledMenuIconStyle} />,
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
      icon: <ShareIcon className={user ? menuIconStyle : disabledMenuIconStyle} />,
      isActive: !!user,
      needsDropdown: true,
      portalContent: <ShareFile closePortal={closePortal} />,
    },
    {
      name: "Settings",
      icon: <SettingsIcon className={user ? menuIconStyle : disabledMenuIconStyle} />,
      isActive: !!user,
      needsDropdown: false,
      portalContent: <div className="p-4">Settings Dropdown Content</div>,
    }
    , {
      name: user ? "Profile" : "Login",
      icon: user ? <UserIcon className={menuIconStyle} /> : <LoginSignupIcon className={menuIconStyle} />,
      isActive: true,
      needsDropdown: true,
      portalContent: <LoginSignup closePortal={closePortal} />,
    }
  ], [user]);

  useEffect(() => {
    const handleHashChange = () => {
      console.log("Hash changed:", window.location.hash);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const openPortal = hashParams.get('openPortal');
      console.log("openPortal param:", openPortal);
      if (openPortal !== "") {
        const menuItem = menuItems.find(item => item.name.toLowerCase() === openPortal?.toLowerCase());
        if (menuItem) {
          console.log("Opening portal for menu item:", menuItem.name);
          setIsPortalVisible(menuItem.needsDropdown ? true : false);
          setActivePortalContent(menuItem.portalContent);
        } else {
          console.log("No matching menu item found. Closing portal");
          setIsPortalVisible(false);
        }
      }
    };

    handleHashChange(); // Check on initial load
    window.addEventListener('hashchange', handleHashChange);



    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    }

  }, [menuItems]);


  const dropdownRef = useRef(null);

  return <div className="h-full w-full grid grid-rows-1 grid-cols-12 gap-1 px-2 ">
    {menuItems.map((item, index) => {
      return <button key={index} className={`grid grid-rows-2 py-2 max-w-full menu-item button`} disabled={!item.isActive} onClick={(e) => {
        if (!item.isActive) return;
        if (item.name === "Settings") {
          navigate('/settings');
          return
        }
        if (item.name === "Profile") {
          navigate('/profile');
          return;
        }
        e.preventDefault();

        window.location.hash = `openPortal=${item.name.toLowerCase()}`;
        setIsPortalVisible(item.needsDropdown ? true : false);
        setActivePortalContent(item.portalContent);
      }}>
        <span onClick={item.action} className="row-span-1 flex justify-center items-center">
          {item.icon}
        </span>
        <span className={`text-sm row-start-2 row-span-1 text-center ${item.isActive ? "" : "text-gray-400"}`}>{item.name}</span>
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