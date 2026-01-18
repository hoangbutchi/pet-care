import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import { useCartStore } from '../store/cartStore';

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${isActive
                ? 'bg-mint-light text-primary shadow-sm'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
        >
            {children}
        </Link>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const { getTotalItems, openCart } = useCartStore();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center">
                            <Logo className="h-10 w-auto" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <NavLink to="/">{t('navbar.home')}</NavLink>
                        <NavLink to="/services">{t('navbar.services')}</NavLink>
                        <NavLink to="/shop">{t('navbar.shop')}</NavLink>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-6">
                        <LanguageSwitcher />

                        <Link
                            to="/booking"
                            className="hidden md:flex items-center bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-gray-900/20 transition-all transform hover:scale-105"
                        >
                            <FaCalendarAlt className="mr-2" />
                            <span>Book Now</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
                                <Link to="/profile" className="flex items-center text-gray-700 hover:text-primary font-medium">
                                    <div className="w-8 h-8 rounded-full bg-mint-light flex items-center justify-center text-primary mr-2">
                                        <FaUser size={14} />
                                    </div>
                                    <span className="hidden sm:inline">{user.name}</span>
                                </Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin" className="text-red-500 font-bold text-sm">ADMIN</Link>
                                        <Link 
                                            to="/email-marketing" 
                                            className="text-gray-700 hover:text-primary transition-colors relative group"
                                            title="Email Marketing"
                                        >
                                            <FaEnvelope size={20} />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Email Marketing
                                            </span>
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={openCart}
                                    className="text-gray-700 hover:text-primary relative transition-colors"
                                >
                                    <FaShoppingCart size={20} />
                                    {getTotalItems() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {getTotalItems() > 9 ? '9+' : getTotalItems()}
                                        </span>
                                    )}
                                </button>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <FaSignOutAlt size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-primary font-bold">{t('navbar.login')}</Link>
                                <Link to="/register" className="hidden sm:block text-primary border-2 border-primary px-4 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                                    {t('navbar.register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
