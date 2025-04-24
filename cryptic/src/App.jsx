import Home from "./pages/home/Home";
import SignUp from "./pages/signUp/SignUp";
import SignIn from "./pages/signIn/SignIn";
import UserProfile from "./pages/userProfile/UserProfile";
import UserProfile2FA from "./pages/userProfile2FA/UserProfile2FA";
import UserProfile2FADisable from "./pages/userProfile2FADisable/UserProfile2FADisable";
import UserProfileChangePassword from "./pages/userProfileChangePassword/UserProfileChangePassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Analytics from "./pages/analytics/Analytics";
import Wallets from "./pages/wallets/Wallets";
import Transactions from "./pages/transactions/Transactions";
import ConnectWallet from "./pages/connectWallet/ConnectWallet";
import NotFound from "./pages/notFound/NotFound";
import RecoveryPassword from "./pages/recoveryPassword/RecoveryPassword";
import { Routes,Route } from "react-router-dom";
import PortfoliosLayout from './components/layout/Layouts/PortfoliosLayout/PortfoliosLayout';
import ProfileLayout from './components/layout/Layouts/ProfileLayout/ProfileLayout';

import "./lib/i18n"
import "./styles/index.css";

function App() {

  return (
    <>
      <Routes>
        <Route element={<PortfoliosLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/:id" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/:id" element={<Analytics />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="wallets/:id" element={<Wallets />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<Transactions />} />
        </Route>

        <Route element={<ProfileLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="twoAuthenticator" element={<UserProfile2FA />} />
          <Route path="twoAuthenticatorDisable" element={<UserProfile2FADisable />} />
          <Route path="changePassword" element={<UserProfileChangePassword />} />
        </Route>

          <Route path="/" element={<Home />} />
          <Route path="signIn" element={<SignIn />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="connectWallet" element={<ConnectWallet />} />
          <Route path="recovery" element={<RecoveryPassword />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
