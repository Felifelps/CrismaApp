import { Navigate } from 'react-router-dom';


export default function NotFound() {
    // replace is to deny user to back to this page
    return <Navigate to="/" replace />;
}