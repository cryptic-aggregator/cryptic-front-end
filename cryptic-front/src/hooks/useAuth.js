import { useSelector } from "react-redux";

export function useAuth() {
  const { accessToken, refreshToken, user, isAuthenticated } = useSelector((state) => state.auth);

  return {
    isAuth: isAuthenticated,
    accessToken,
    refreshToken,
    user,
  };
}
