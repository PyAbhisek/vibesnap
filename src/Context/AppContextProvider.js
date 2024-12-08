import { createContext, useState } from "react"

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    const updateUserInfo = (updatedData) => {
        setUserInfo((prevState) => {
            const newState = { ...prevState, ...updatedData };
            localStorage.setItem("user", JSON.stringify(newState));

            return newState;
        });
    };

    const clearUserInfo = () => {
        setUserInfo({});
        localStorage.removeItem("user");
        localStorage.removeItem("lastLoginDate");
    };

    return (
        <AppContext.Provider value={{
            userInfo,
            setUserInfo,
            updateUserInfo,
            clearUserInfo
        }}>
            {children}
        </AppContext.Provider>
    )
}