import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const fillDemoCredentials = () => {
        setFormData({
            email: 'demo@bugtracker.com',
            password: 'demo123',
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="glass-card p-8 md:p-12 max-w-md w-full relative z-10 animate-scale-in">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-4 shadow-xl shadow-violet-500/40 animate-pulse-glow">
                        <span className="text-4xl">🐛</span>
                    </div>
                    <h1 className="text-3xl font-bold gradient-text">
                        BugTracker Pro
                    </h1>
                    <p className="text-gray-400 mt-2">Welcome back! Please login to continue.</p>
                </div>

                {/* Demo Credentials Box */}
                <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🔐</span>
                        <span className="text-sm font-semibold text-violet-400">Demo Credentials</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                        <p><span className="text-gray-500">Email:</span> <code className="text-violet-300">demo@bugtracker.com</code></p>
                        <p><span className="text-gray-500">Password:</span> <code className="text-violet-300">demo123</code></p>
                    </div>
                    <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="mt-3 text-xs bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 px-3 py-1.5 rounded-lg transition-all border border-violet-500/30"
                    >
                        ✨ Auto-fill Demo Credentials
                    </button>
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

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="spinner w-5 h-5"></div>
                                Logging in...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <span>🚀</span>
                                Login to Dashboard
                            </span>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Sign up for free
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

export default Login;
