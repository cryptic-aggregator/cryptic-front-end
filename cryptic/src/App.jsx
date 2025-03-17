import Home from "./pages/home/Home";
import SignUp from "./pages/signUp/SignUp";
import SignIn from "./pages/signIn/SignIn";
import UserProfile from "./pages/userProfile/UserProfile";
import UserProfile2FA from "./pages/userProfile2FA/UserProfile2FA";
import UserProfile2FADisable from "./pages/userProfile2FADisable/UserProfile2FADisable";
import UserProfileChangePassword from "./pages/userProfileChangePassword/UserProfileChangePassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/analytics/Analytics";
import ConnectWallet from "./pages/connectWallet/ConnectWallet";
import { Routes,Route } from "react-router-dom";

import "./lib/i18n"
import "./styles/index.css";

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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/:id" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/:id" element={<Analytics />} />
          <Route path="connectWallet" element={<ConnectWallet />} />
      </Routes>
    </>
  )
}

export default App
