import { Navigate, Outlet } from "react-router-dom";

const TwoFactorGate = ({ isTwoFactorEnabled, allowIf2FAActive }) => {
  if (allowIf2FAActive && !isTwoFactorEnabled) {
    // Користувач намагається зайти в "вимкнення 2FA", але 2FA не активована
    return <Navigate to="/twoAuthenticator" replace />;
  }

  if (!allowIf2FAActive && isTwoFactorEnabled) {
    // Користувач намагається зайти на активацію 2FA, але 2FA вже активована
    return <Navigate to="/twoAuthenticatorDisable" replace />;
  }

  return <Outlet />;
};

export default TwoFactorGate;
