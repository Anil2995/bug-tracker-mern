import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/dashboard');
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-fuchsia-600/30 to-pink-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gradient-to-r from-cyan-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="glass-card p-8 md:p-12 max-w-md w-full relative z-10 animate-scale-in">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl mb-4 shadow-xl shadow-fuchsia-500/40 animate-pulse-glow">
                        <span className="text-4xl">🚀</span>
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">
                        Join BugTracker Pro
                    </h1>
                    <p className="text-gray-400 mt-2">Create your account to get started</p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-2xl">📊</span>
                        <p className="text-xs text-gray-400 mt-1">Track Bugs</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-2xl">📋</span>
                        <p className="text-xs text-gray-400 mt-1">Kanban Board</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-2xl">👥</span>
                        <p className="text-xs text-gray-400 mt-1">Team Collab</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 animate-slide-down">
                        <div className="flex items-center gap-2">
                            <span>⚠️</span>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">👤</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">📧</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-12"
                                    placeholder="••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field pl-12"
                                    placeholder="••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="spinner w-5 h-5"></div>
                                Creating account...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>✨</span>
                                Create Account
                            </span>
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer Credit */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-500 text-sm">
                        Built with ❤️ by{' '}
                        <span className="text-violet-400 font-medium">siddemanilkumar@gmail.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
