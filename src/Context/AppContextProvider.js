import { createContext, useState } from "react"

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const storedUser = window.sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    const updateUserInfo = (updatedData) => {
        setUserInfo((prevState) => {
            const newState = { ...prevState, ...updatedData };
            window.sessionStorage.setItem("user", JSON.stringify(newState));

            return newState;
        });
    };

    const clearUserInfo = () => {
        setUserInfo({});
        window.sessionStorage.removeItem("user");
        window.sessionStorage.removeItem("lastLoginDate");
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