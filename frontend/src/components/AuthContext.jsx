import { createContext, useEffect, useState } from "react"
import { axiosInstance } from "../lib/axiosInstance"

export const AuthContext = createContext({
  user: null,
  setUser: null,
  initialLoading: true
})

export const AuthContextProvider = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axiosInstance.get("/user/status")
        setInitialLoading(false)
        setUser(response.data.user)
      } catch (error) {
        setInitialLoading(false)
      }
    }

    checkStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, initialLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
