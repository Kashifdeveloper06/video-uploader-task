import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(firstName, password);
            navigate('/');
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
            <p className="mt-4 text-center">
                Not signed up yet?{' '}
                <Link to="/register" className="text-blue-500 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default Login;
