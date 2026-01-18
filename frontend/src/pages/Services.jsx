import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';

// Service Emoji Icons
const serviceEmojis = {
    ambulance: '🚑',
    syringe: '💉', 
    stethoscope: '🩺',
    surgery: '🏥',
    tooth: '🦷',
    grooming: '🛁',
    shield: '🦠',
    microscope: '🔬',
    monitor: '👨‍⚕️'
};

const Services = () => {
    const { t } = useTranslation();
    const groups = t('services_page.groups', { returnObjects: true });

    // Emoji Mapping
    const serviceIcons = [
        serviceEmojis.ambulance,      // 0: Emergency
        serviceEmojis.syringe,        // 1: Vaccination
        serviceEmojis.shield,         // 2: Parasite Prevention
        serviceEmojis.microscope,     // 3: Health Screening
        serviceEmojis.stethoscope,    // 4: General Exam
        serviceEmojis.monitor,        // 5: Diagnostic Imaging
        serviceEmojis.surgery,        // 6: General Surgery
        '⚕️',                         // 7: Spay & Neuter
        '🤱',                         // 8: Maternity
        serviceEmojis.tooth,          // 9: Dental
        serviceEmojis.grooming        // 10: Grooming
    ];

    // Floating Pet Icons Background Component
    const FloatingPets = () => (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[
                { src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop", top: "5rem", left: "2.5rem", size: "12rem", delay: "0s" },
                { src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop", top: "10rem", right: "5rem", size: "14rem", delay: "2s" },
                { src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop", bottom: "10rem", left: "8rem", size: "13rem", delay: "4s" },
                { src: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop", bottom: "5rem", right: "10rem", size: "11rem", delay: "1s" },
                { src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop", top: "33%", left: "25%", size: "10rem", delay: "3s" },
                { src: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300&h=300&fit=crop", top: "66%", right: "33%", size: "12rem", delay: "5s" },
            ].map((img, idx) => (
                <motion.img
                    key={idx}
                    src={img.src}
                    className="absolute rounded-full opacity-10 object-cover"
                    style={{
                        top: img.top,
                        left: img.left,
                        right: img.right,
                        bottom: img.bottom,
                        width: img.size,
                        height: img.size,
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        rotate: [-5, 5, -5]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: parseFloat(img.delay)
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins'] relative">
            <FloatingPets />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 pt-32 pb-24 overflow-hidden">
                {/* Floating Blobs Animation */}
                <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] bg-blue-100/50 rounded-full animate-float blur-3xl" />
                <div className="absolute -bottom-[30%] -left-[10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full animate-float-reverse blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-sm text-gray-900"
                    >
                        {t('services_page.title')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        {t('services_page.subtitle')}
                    </motion.p>

                    {/* Hero Stats */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12 animate-fadeInUp">
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg min-w-[200px]">
                            <span className="block text-4xl font-extrabold mb-2 text-primary">5000+</span>
                            <span className="text-sm md:text-base font-medium text-gray-600">{t('services_page.stats.pets')}</span>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg min-w-[200px]">
                            <span className="block text-4xl font-extrabold mb-2 text-primary">15+</span>
                            <span className="text-sm md:text-base font-medium text-gray-600">{t('services_page.stats.doctors')}</span>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg min-w-[200px]">
                            <span className="block text-4xl font-extrabold mb-2 text-primary">24/7</span>
                            <span className="text-sm md:text-base font-medium text-gray-600">{t('services_page.stats.support')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative">
                    <div className="absolute -top-1/2 -right-[10%] w-96 h-96 bg-cream/20 rounded-full blur-2xl" />

                    <div className="relative z-10 flex-1 text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{t('services_page.emergency.title')}</h3>
                        <p className="text-white text-lg">{t('services_page.emergency.desc')}</p>
                    </div>
                    {/* CTA Button Section */}
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                        <div className="text-2xl font-extrabold">{t('services_page.emergency.hotline')}</div>
                        <button className="bg-white text-red-600 px-8 py-3 rounded-2xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
                            {t('services_page.emergency.call_now')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

                {/* Preventive Care */}
                {groups?.preventive && (
                    <section>
                        <div className="text-center mb-16">
                            <span className="inline-block bg-cream text-primary px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-4 shadow-lg shadow-tan/30 border border-primary/10">
                                {groups.preventive.tag}
                            </span>
                            <h2 className="text-4xl font-extrabold text-primary mb-4">{groups.preventive.title}</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{groups.preventive.desc}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {groups.preventive.items.map((item, idx) => (
                                <div key={idx} className="group bg-white rounded-3xl p-8 shadow-[0_4px_25px_rgba(141,136,116,0.1)] hover:shadow-[0_15px_45px_rgba(141,136,116,0.2)] hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-cream relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-primary to-tan scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                                    <div className="w-20 h-20 bg-gradient-to-br from-cream to-tan/30 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
                                        <span className="text-4xl">{serviceIcons[item.iconKey]}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-primary mb-3">{item.title}</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{item.desc}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="bg-cream text-primary px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                                            {item.meta.time}
                                        </span>
                                        <span className="bg-cream text-primary px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                                            {item.meta.note}
                                        </span>
                                        <span className="bg-cream text-primary px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                                            {item.meta.safety}
                                        </span>
                                    </div>

                                    <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary mb-6">
                                        {item.price}
                                    </div>

                                    <Link to={item.link}>
                                        <button className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 mb-3">
                                            Đặt Lịch Ngay
                                        </button>
                                    </Link>
                                    <Link to={item.link}>
                                        <button className="w-full bg-transparent text-gray-900 border-2 border-gray-900 py-3 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all">
                                            Tìm Hiểu Thêm →
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Medical & Diagnostics */}
                {groups?.medical && (
                    <section className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
                        <div className="text-center mb-16">
                            <span className="inline-block bg-blue-100 text-primary px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-4 shadow-lg shadow-blue-100/50">
                                {groups.medical.tag}
                            </span>
                            <h2 className="text-4xl font-extrabold text-primary mb-4">{groups.medical.title}</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{groups.medical.desc}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {groups.medical.items.map((item, idx) => (
                                <Link key={idx} to={item.link} className="block group">
                                    <div className="bg-gradient-to-br from-cream/50 to-white p-8 rounded-3xl border border-transparent hover:border-tan transition-all duration-300 hover:shadow-xl hover:-translate-x-1 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left h-full">
                                        <div className="w-24 h-24 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                            <span className="text-5xl">{serviceIcons[item.iconKey]}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{item.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Surgery */}
                {groups?.surgical && (
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 pl-4 border-l-8 border-accent">
                            {groups.surgical.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {groups.surgical.items.map((item, idx) => (
                                <Link key={idx} to={item.link} className="block group h-full">
                                    <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-accent group-hover:-translate-y-2">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 flex items-center justify-center p-2 bg-cream rounded-2xl">
                                                <span className="text-3xl">{serviceIcons[item.iconKey]}</span>
                                            </div>
                                            <div className="bg-cream text-accent p-3 rounded-xl rotate-0 group-hover:rotate-12 transition-transform">
                                                <FaCalendarAlt size={20} />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-accent transition-colors">{item.title}</h3>
                                        <p className="text-gray-600 mb-6">{item.desc}</p>
                                        <span className="text-accent font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                            View Details <FaArrowRight size={14} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

            </div>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 py-24 text-center">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Ready to Give Your Pet the Best Care?</h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Our experienced veterinarians are here to provide the best care for your pets.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/booking"
                            className="px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Schedule Now
                        </Link>
                        <button className="px-8 py-4 bg-transparent border-2 border-gray-900 text-gray-900 rounded-2xl text-lg font-bold hover:bg-gray-900 hover:text-white transition-all">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
