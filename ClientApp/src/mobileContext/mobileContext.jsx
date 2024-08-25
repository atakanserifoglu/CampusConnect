import { createContext, useContext, useState } from 'react';

const MobileContext = createContext();

export const MobileProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const setMobile = (value) => {
    setIsMobile(value);
  };

  const setMenu = (value) => {
    setShowMenu(value);
  };
  return (
    <MobileContext.Provider value={{ isMobile, setMobile, showMenu, setMenu }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  return useContext(MobileContext);
};
export const useSidebarVisibility = () => {
  return useContext(MobileContext);
};
