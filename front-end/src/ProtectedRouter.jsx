import { Navigate, Outlet } from "react-router-dom"

import { useUser } from "./store/userStore"

function ProtectedRoute(props){
    const userInfo = useUser((state) => state.userInfo)

    if (!userInfo) return <Navigate to="/user/login" replace />
    if (props.allowedRoles && !props.allowedRoles.includes(userInfo.role)) {
        return <Navigate to="/" replace />
    }
    return <Outlet />
}

export default ProtectedRoute