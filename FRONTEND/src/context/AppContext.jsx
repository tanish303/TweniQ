import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial profileMode from localStorage or default to 'social'
  const [profileMode, setProfileMode] = useState(() => {
    return localStorage.getItem("profileMode") || "social";
  });

  const [globalusername, setglobalusername] = useState("");

  // Sync profileMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("profileMode", profileMode);
  }, [profileMode]);

  const toggleProfile = () => {
    setProfileMode((prev) => (prev === "social" ? "professional" : "social"));
  };

  return (
    <AppContext.Provider
      value={{
        globalusername,
        setglobalusername,
        profileMode,
        setProfileMode,
        toggleProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const useProfile = () => {
  const { profileMode, setProfileMode, toggleProfile } = useApp();
  return { profileMode, setProfileMode, toggleProfile };
};
