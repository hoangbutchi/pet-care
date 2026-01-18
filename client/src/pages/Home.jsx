import { useState, useEffect, useCallback } from 'react';
import { Heart, Phone, Calendar, Sparkles, ChevronRight, ShoppingCart, Star, Stethoscope, Scissors, Store, Award, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isValidToken } = useAuth();
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);

    const testimonials = t('home.testimonials.items', { returnObjects: true });

    // Fetch user appointments
    useEffect(() => {
        if (user && isValidToken()) {
            // Add a small delay to ensure token is properly set
            setTimeout(() => {
                fetchAppointments();
            }, 100);
        }
    }, [user, isValidToken]);

    const fetchAppointments = async () => {
        // Don't fetch if user doesn't have a valid token
        if (!isValidToken()) {
            console.log('Skipping appointments fetch - no valid token');
            return;
        }

        setLoadingAppointments(true);
        try {
            const response = await axios.get('/appointments/my');
            setAppointments(response.data.slice(0, 3)); // Show only latest 3
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
            // Don't show error to user, just log it
            setAppointments([]); // Set empty array so UI doesn't break
        } finally {
            setLoadingAppointments(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'COMPLETED':
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'CANCELLED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    // Ensure testimonials is an array to avoid crashes if translation loads slowly
    const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

    useEffect(() => {
        if (safeTestimonials.length > 0) {
            const interval = setInterval(() => {
                setActiveTestimonial(prev => (prev + 1) % safeTestimonials.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [safeTestimonials.length]);

    const services = [
        {
            icon: Stethoscope,
            title: t('home.services.vet.title'),
            description: t('home.services.vet.description'),
            color: 'from-indigo-500 to-purple-500',
            link: '/services'
        },
        {
            icon: Scissors,
            title: t('home.services.grooming.title'),
            description: t('home.services.grooming.description'),
            color: 'from-blue-500 to-cyan-500',
            link: '/grooming'
        },
        {
            icon: Store,
            title: t('home.services.shop.title'),
            description: t('home.services.shop.description'),
            color: 'from-purple-500 to-pink-500',
            link: '/shop'
        },
        {
            icon: Heart, // Using Heart as placeholder for Emergency/Other
            title: t('home.services.emergency.title'),
            description: t('home.services.emergency.description'),
            color: 'from-red-500 to-pink-500',
            featured: true,
            link: '/emergency'
        }
    ];

    return (
        <div className="relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-20 left-10 opacity-6 animate-float">
                    <svg width="300" height="300" viewBox="0 0 200 200" className="filter blur-[1px]">
                        <defs>
                            <linearGradient id="dogGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8D8741" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#BC986A" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>
                        <ellipse cx="100" cy="130" rx="60" ry="70" fill="url(#dogGrad1)" />
                        <circle cx="100" cy="70" r="45" fill="url(#dogGrad1)" />
                    </svg>
                </div>
                <div className="absolute top-32 right-20 opacity-6 animate-float" style={{ animationDelay: '2s' }}>
                    <svg width="280" height="280" viewBox="0 0 200 200" className="filter blur-[1px]">
                        <defs>
                            <linearGradient id="catGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#659DBD" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#DAAD86" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>
                        <ellipse cx="100" cy="140" rx="55" ry="60" fill="url(#catGrad1)" />
                        <circle cx="100" cy="80" r="40" fill="url(#catGrad1)" />
                    </svg>
                </div>
            </div>

            <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-25px) rotate(-2deg); }
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
            `}</style>

            {/* HERO SECTION */}
            <section id="home" className="relative z-10 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream rounded-full">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">{t('home.premium')}</span>
                        </div>

                        <div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">{t('home.hero.title')}</h1>
                            <h2 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
                                {t('home.hero.subtitle')}
                            </h2>
                        </div>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">{t('home.hero.desc')}</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/booking" className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition">
                                <Calendar className="w-5 h-5" />
                                {t('home.hero.book_appointment')}
                            </Link>
                            <Link to="/shop" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold text-lg border-2 border-cream hover:border-primary hover:bg-cream transition">
                                <ShoppingCart className="w-5 h-5" />
                                {t('home.hero.shop_now')}
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-6 pt-8 border-t border-gray-200">
                            {[
                                { icon: Award, title: t('home.badges.licensed'), color: 'bg-cream text-primary' },
                                { icon: Phone, title: t('home.badges.emergency'), color: 'bg-secondary/10 text-secondary' },
                                { icon: Heart, title: t('home.badges.premium'), color: 'bg-tan/20 text-accent' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 z-10"></div>
                                <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=500&fit=crop"
                                    alt="Happy golden retriever" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition duration-500 mt-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-tan/20 z-10"></div>
                                <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=500&fit=crop"
                                    alt="Cute cat" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <Heart className="w-16 h-16 text-accent opacity-20 animate-pulse" fill="currentColor" />
                        </div>
                    </div>
                </div>
            </section>

            {/* MY APPOINTMENTS SECTION - Only show if user is logged in */}
            {user && (
                <section className="relative z-10 py-16">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">My Recent Appointments</h3>
                            <p className="text-gray-600">Track your upcoming and past appointments</p>
                        </div>
                        <Link 
                            to="/profile" 
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        >
                            View All
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loadingAppointments ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading appointments...</p>
                        </div>
                    ) : appointments.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(appointment.status)}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <div className="text-right text-sm text-gray-500">
                                            {new Date(appointment.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-gray-900">{appointment.service}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
                                        </div>
                                        {appointment.pet && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Heart className="w-4 h-4" />
                                                <span>{appointment.pet.name} ({appointment.pet.species})</span>
                                            </div>
                                        )}
                                        {appointment.notes && (
                                            <p className="text-sm text-gray-500 mt-2 italic">"{appointment.notes}"</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-600 mb-2">No appointments yet</h4>
                            <p className="text-gray-500 mb-6">Book your first appointment to get started</p>
                            <Link 
                                to="/booking" 
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                            >
                                <Calendar className="w-5 h-5" />
                                Book Appointment
                            </Link>
                        </div>
                    )}
                </section>
            )}

            {/* SERVICES SECTION */}
            <section id="services" className="relative z-10 py-16 lg:py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">{t('home.services.what_we_offer')}</span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                        {t('home.services.our_services')}
                    </h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('home.services.desc')}</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, i) => (
                        <Link to={service.link} key={i}>
                            <div className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden h-full flex flex-col ${service.featured ? 'ring-2 ring-red-500' : ''
                                }`}>
                                {service.featured && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                        24/7
                                    </div>
                                )}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-lg shrink-0`}>
                                    <service.icon className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{service.description}</p>
                                <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all mt-auto">
                                    {t('home.learn_more')}
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="relative z-10 py-16 bg-cream/30">
                <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        {t('home.testimonials.title')}
                    </h3>
                </div>

                {safeTestimonials.length > 0 && (
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-cream rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10">
                            <div className="text-6xl mb-6 text-center">{safeTestimonials[activeTestimonial]?.avatar}</div>
                            <div className="flex justify-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-xl text-gray-700 text-center mb-6 leading-relaxed">
                                "{safeTestimonials[activeTestimonial]?.text}"
                            </p>
                            <div className="text-center">
                                <div className="font-bold text-gray-900">{safeTestimonials[activeTestimonial]?.name}</div>
                                <div className="text-sm text-gray-500">{safeTestimonials[activeTestimonial]?.pet}</div>
                            </div>
                            <div className="flex justify-center gap-2 mt-8">
                                {safeTestimonials.map((_, i) => (
                                    <button key={i} onClick={() => setActiveTestimonial(i)}
                                        className={`w-2 h-2 rounded-full transition ${i === activeTestimonial ? 'bg-primary w-8' : 'bg-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* CTA SECTION */}
            <section id="contact" className="relative z-10 py-16 mb-16">
                <div className="relative bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 px-8 py-16 lg:py-20 text-center">
                        <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">{t('home.cta.title')}</h3>
                        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">{t('home.cta.desc')}</p>
                        <Link to="/booking" className="inline-flex items-center gap-3 px-10 py-5 bg-cream text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition">
                            <Calendar className="w-6 h-6" />
                            {t('home.cta.schedule_now')}
                            <ChevronRight className="w-6 h-6" />
                        </Link>
                    </div>
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
                </div>
            </section>
        </div>
    );
};

export default Home;
