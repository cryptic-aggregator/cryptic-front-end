import { useSelector } from "react-redux";

export function useAuth() {
  const { accessToken, refreshToken, isAuthenticated } = useSelector((state) => state.auth);

  return {
    isAuth: isAuthenticated,
    accessToken,
    refreshToken,
  };
}
