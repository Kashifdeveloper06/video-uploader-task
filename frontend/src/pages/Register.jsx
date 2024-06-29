import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { firstName, lastName, email, phoneNumber });
            toast.success('An email has been sent to your email. Check your email for details.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error("Registration failed:", error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    required
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    required
                />
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Register'}
                </button>
            </form>
            <p className="mt-4 text-center">
                Already registered?{' '}
                <Link to="/login" className="text-blue-500 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
};

export default Register;
