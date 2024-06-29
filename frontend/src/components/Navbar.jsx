import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    }

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">VideoApp</Link>
                <div>
                    {user ? (
                        <>
                           <Link to="/listing" className="mr-4">Listing</Link>
                            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4">Login</Link>
                            <Link to="/register" className="bg-green-500 px-4 py-2 rounded">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;