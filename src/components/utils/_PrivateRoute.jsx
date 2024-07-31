import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const _PrivateRoute = ({children}) => {
    const data = useSelector(state => state.auth)
    const route = data?.accessToken && data?.user ? children : <Navigate to='/'/>
  return route;
}

export default _PrivateRoute