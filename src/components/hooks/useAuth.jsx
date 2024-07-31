import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "../features/auth/authSlice";

const useAuth = () => {
    const [isState, setIsState] = useState(false);
    const dispatch = useDispatch();

  const storageData = localStorage.getItem('auth')
  const convertStringToObject = JSON.parse(storageData);
  const {accessToken, user} = convertStringToObject ?? {};

  useEffect(() => {
    if(accessToken && user) {
        dispatch(logIn({
            accessToken,
            user
        }))
        setIsState(true);
    } else {
        setIsState(true);
    } 
  }, [accessToken, user, dispatch, setIsState])
  

  return isState;
}

export default useAuth