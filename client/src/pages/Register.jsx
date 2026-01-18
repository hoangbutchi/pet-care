import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(formData);
        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-12">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input type="text" name="name" onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name="email" onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Phone</label>
                        <input type="text" name="phone" onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Address</label>
                        <input type="text" name="address" onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Registering...' : 'Register Account'}
                    </button>
                    <p className="mt-4 text-center text-sm">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
