import Home from "./pages/home/Home.js";
import SignUp from "./pages/signUp/SignUp.js";
import SignIn from "./pages/signIn/SignIn.js";
import UserProfile from "./pages/userProfile/UserProfile.js";
import { Routes,Route } from "react-router-dom";
import "./lib/i18n"
import "./styles/styles.css";

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signIn" element={<SignIn />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="userProfile" element={<UserProfile />} />
      </Routes>
    </>
  );
}

export default App;

