import { Navigate } from 'react-router-dom';

import { useToken } from "../contexts/Token";

import { clearAll } from "../utils/localStorage";

export default function Logout() {
    // replace is to deny user to back to this page
    useToken().setToken('')
    clearAll();
    return <Navigate to="/" replace />;
}
