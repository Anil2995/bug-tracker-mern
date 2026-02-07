import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TourGuide from './TourGuide';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '🎯' },
        { path: '/projects', label: 'Projects', icon: '📁' },
        { path: '/my-tickets', label: 'My Tickets', icon: '🎫' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Navigation Bar - Only show when logged in */}
            {!isAuthPage && user && (
                <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link to="/dashboard" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all group-hover:scale-105">
                                    <span className="text-white font-bold text-lg">🐛</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                    BugTracker
                                </span>
                            </Link>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 nav-${item.label.toLowerCase().replace(' ', '-')} ${location.pathname === item.path
                                            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-300 hidden sm:block">
                                        {user?.name || 'User'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-all border border-red-500/20 hover:border-red-500/40"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                {user && <TourGuide />}
                {children}
            </main>

            {/* Footer */}
            <footer className="relative z-10 mt-auto">
                <div className="backdrop-blur-xl bg-slate-900/80 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Brand */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                                        <span className="text-white font-bold text-lg">🐛</span>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                        BugTracker Pro
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    A complete bug tracking and project management solution built with the MERN stack.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className="space-y-4">
                                <h4 className="text-white font-semibold">Quick Links</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <Link to="/dashboard" className="text-gray-400 hover:text-violet-400 transition-colors">Dashboard</Link>
                                    <Link to="/projects" className="text-gray-400 hover:text-violet-400 transition-colors">Projects</Link>
                                    <Link to="/my-tickets" className="text-gray-400 hover:text-violet-400 transition-colors">My Tickets</Link>
                                </div>
                            </div>

                            {/* Developer Info */}
                            <div className="space-y-4">
                                <h4 className="text-white font-semibold">Developer</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-lg">👨‍💻</span>
                                        <span className="font-medium text-white">Siddem Anil Kumar</span>
                                    </div>
                                    <a
                                        href="mailto:siddemanilkumar@gmail.com"
                                        className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
                                    >
                                        <span className="text-lg">📧</span>
                                        <span>siddemanilkumar@gmail.com</span>
                                    </a>
                                    <a
                                        href="https://github.com/Anil2995"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        <span>GitHub</span>
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/anilkumar05/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                        <span>LinkedIn</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <p className="text-gray-500 text-sm">
                                    © {new Date().getFullYear()} BugTracker Pro. Built with ❤️ by{' '}
                                    <span className="text-violet-400 font-medium">Siddem Anil Kumar</span>
                                </p>
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <span>Built with</span>
                                    <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded text-xs font-medium">React</span>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-medium">Node.js</span>
                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">MongoDB</span>
                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs font-medium">Express</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
