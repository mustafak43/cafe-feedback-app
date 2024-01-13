// GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();
const UserContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalList, setGlobalList] = useState([]);

  return (
    <GlobalContext.Provider value={{ globalList, setGlobalList }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};


export const UserInfoProvider = ({ children }) => {
  const [user, setUser] = useState();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserInfo = () => {
  return useContext(UserContext);
};