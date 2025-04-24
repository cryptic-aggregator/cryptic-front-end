import { useSelector } from "react-redux";

export function useUser() {
  const { user, isLoading, error, messageRecoveryPassword } = useSelector((state) => state.userStore);

  return {
    user,
    isLoading,
    error,
    messageRecoveryPassword,
  };
}
