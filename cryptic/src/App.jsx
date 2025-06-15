import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";

import UserProfile from "./pages/UserProfile/UserProfile";
import UserProfile2FA from "./pages/UserProfile/TwoFA/TwoFA";
import UserProfile2FADisable from "./pages/UserProfile/TwoFADisable/TwoFADisable";
import UserProfileChangePassword from "./pages/UserProfile/ChangePassword/ChangePassword";

import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";
import Wallets from "./pages/Wallets/Wallets";
import Transactions from "./pages/Transactions/Transactions";
import ConnectWallet from "./pages/ConnectWallet/ConnectWallet";
import Transfer from "./pages/Transfer/Transfer";
import NotFound from "./pages/NotFound/NotFound";
import RecoveryPassword from "./pages/PasswordRecovery/PasswordRecovery";
import { Routes,Route } from "react-router-dom";
import PortfoliosLayout from './components/layout/Portfolio/Portfolio';
import ProfileLayout from './components/layout/Profile/Profile';

import "./lib/i18n"
import "./styles/index.css";
import { useAuth } from "./hooks/useAuth";
import PublicOnlyRoute from "./components/routes/PublicOnlyRoute";
import PrivateRoute from "./components/routes/PrivateRoute";
import TwoFactorGate from "./components/routes/TwoFactorGate";
import { useUser } from "./hooks/useUser";
import Premium from "./pages/UserProfile/Premium/Premium";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import { useEffect, useState } from "react";
import { initializeAuth } from "./store";

function App() {
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    (async () => {
      await initializeAuth();
      setInitDone(true);
    })();
  }, []);

  const { isAuth } = useAuth();
  const { user } = useUser();

  if (!initDone) {

    return <div></div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route element={<PublicOnlyRoute isAuthenticated={isAuth} />}>
          <Route path="signIn" element={<SignIn />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="recovery" element={<RecoveryPassword />} />
        </Route>

        <Route element={<PrivateRoute isAuthenticated={isAuth} />}>
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
              <Route element={<TwoFactorGate isTwoFactorEnabled={user?.isTwoFactorEnabled} allowIf2FAActive={false} />}>
                <Route path="twoAuthenticator/enabled" element={<UserProfile2FA />} />
              </Route>
              <Route element={<TwoFactorGate isTwoFactorEnabled={user?.isTwoFactorEnabled} allowIf2FAActive={true} />}>
                <Route path="twoAuthenticator/disable" element={<UserProfile2FADisable />} />
              </Route>
              <Route path="changePassword" element={<UserProfileChangePassword />} />
              <Route path="premium" element={<Premium />} />
            </Route>

            <Route path="connectWallet" element={<ConnectWallet />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="transfer/:id" element={<Transfer />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
