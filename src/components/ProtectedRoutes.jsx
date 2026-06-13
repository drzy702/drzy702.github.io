import {Navigate, Outlet} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoutes() {
    const { currentUser } = useAuth()

    if (!currentUser) return <Navigate to="/login" />

    return <Outlet />
}