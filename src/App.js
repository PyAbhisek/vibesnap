import './App.css';
import SignUp from './Components/SignUp';
import EditProfile from './Components/EditProfile';
import { useContext, useEffect } from 'react';
import { AppContext } from './Context/AppContextProvider';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { userInfo, setUserInfo } = context;
  const navigate = useNavigate();
  const isUserLoggedIn = Object.keys(userInfo).length > 0;

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo(user);
    }


    const lastLoginDate = window.sessionStorage.getItem("lastLoginDate");
    if (lastLoginDate) {
      const currentDate = new Date().getTime();
      const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      if (currentDate - lastLoginDate > sevenDaysInMilliseconds) {
        window.sessionStorage.clear();
        setUserInfo({});
      }
    }
  }, [setUserInfo]);

  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/profile');
    }
  }, [isUserLoggedIn, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={!isUserLoggedIn ? <SignUp /> : <EditProfile />} />
        <Route path="/profile" element={isUserLoggedIn ? <EditProfile /> : <SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
