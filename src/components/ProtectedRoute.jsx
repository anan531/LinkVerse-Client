import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
    const [checking, setChecking] = useState(true);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
            setValid(false);
            setChecking(false);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const currentTime = Date.now() / 1000;

            if (payload.exp && payload.exp < currentTime) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setValid(false);
            } else if (adminOnly && user.role !== "admin") {
                setValid(false);
            } else {
                setValid(true);
            }
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setValid(false);
        }

        setChecking(false);
    }, [adminOnly]);

    if (checking) {
        return null;
    }

    if (!valid) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;