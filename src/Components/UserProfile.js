import { useContext } from "react"
import { AppContext } from "../Context/AppContextProvider"

const UserProfile = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }
    const { userInfo } = context
    console.log(userInfo, "userInfo")
    return (
        <>
            <div>
                "userinfo"
            </div>
        </>
    )
}

export default UserProfile