import './App.css';
import SignUp from './Components/SignUp';
import UserProfile from './Components/UserProfile';
import { useContext, useEffect } from 'react';
import { AppContext } from './Context/AppContextProvider';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContextProvider");
  }
  const { userInfo } = context;
  const navigate = useNavigate();
  const isUserLoggedIn = Object.keys(userInfo).length > 0;
  useEffect(() => {
    if (isUserLoggedIn) {
      navigate('/profile');
    }
  }, [isUserLoggedIn, navigate]);

  return (

    <div className="App">
      <Routes>
        <Route path="/" element={!isUserLoggedIn ? <SignUp /> : <UserProfile />} />
        <Route path="/profile" element={isUserLoggedIn ? <UserProfile /> : <SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
