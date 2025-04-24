import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuth } = useUser();

  useEffect(() => {
    if (!isAuth) {
      navigate("/signin");
    }
  }, [isAuth, navigate]);
};

export default useAuthRedirect;