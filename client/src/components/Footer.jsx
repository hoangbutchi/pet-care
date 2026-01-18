import { Heart, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { t } = useTranslation();

    const services = [
        { title: t('footer.services.emergency'), link: '/emergency' },
        { title: t('footer.services.veterinary'), link: '/services' },
        { title: t('footer.services.grooming'), link: '/grooming' },
        { title: t('footer.services.shop'), link: '/shop' },
    ];

    return (
        <footer className="relative z-10 bg-gray-900 text-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
                            <span className="text-2xl font-bold">PetCare<span className="text-primary">+</span></span>
                        </div>
                        <p className="text-gray-400">{t('footer.premium_care')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('navbar.contact')}</h4>
                        <div className="space-y-2 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>+84 123 456 789</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>info@petcare.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>Hanoi, Vietnam</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('navbar.services')}</h4>
                        <ul className="space-y-2 text-gray-400">
                            {services.map((s, i) => (
                                <li key={i}>
                                    <Link to={s.link} className="hover:text-white transition-colors">{s.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>© 2026 PetCare+. Bản quyền thuộc về Đào Văn Hoàng.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
