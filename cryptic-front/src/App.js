import Home from "./pages/home/Home.js";
import SignUp from "./pages/signUp/SignUp.js";
import SignIn from "./pages/signIn/SignIn.js";
import UserProfile from "./pages/userProfile/UserProfile.js";
import UserProfile2FA from "./pages/userProfile2FA/UserProfile2FA.js";
import UserProfile2FADisable from "./pages/userProfile2FADisable/UserProfile2FADisable.js";
import UserProfileChangePassword from "./pages/userProfileChangePassword/UserProfileChangePassword.js";
import Dashboard from "./pages/dashboard/Dashboard.js";
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
          <Route path="profile" element={<UserProfile />} />
          <Route path="twoAuthenticator" element={<UserProfile2FA />} />
          <Route path="twoAuthenticatorDisable" element={<UserProfile2FADisable />} />
          <Route path="changePassword" element={<UserProfileChangePassword />} />
          <Route path="portfolio/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;

