"use client"

import { createContext, useContext, useState } from "react"

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // Auth state
  const [globalusername, setglobalusername] = useState("")

  // Profile state
  const [profileMode, setProfileMode] = useState("social")

  // Profile toggle method
  const toggleProfile = () => {
    setProfileMode((prev) => (prev === "social" ? "professional" : "social"))
  }

  return (
    <AppContext.Provider
      value={{
        // Auth state
        globalusername,
        setglobalusername,
        // Profile state
        profileMode,
        setProfileMode,
        toggleProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// General-purpose hook
export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

// Profile-specific hook for backward compatibility
export const useProfile = () => {
  const { profileMode, setProfileMode, toggleProfile } = useApp()
  return { profileMode, setProfileMode, toggleProfile }
}
