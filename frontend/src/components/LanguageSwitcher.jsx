import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
                onClick={() => changeLanguage('en')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${i18n.language === 'en'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <span>🇬🇧</span> English
            </button>
            <button
                onClick={() => changeLanguage('vi')}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${i18n.language === 'vi'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <span>🇻🇳</span> Tiếng Việt
            </button>
        </div>
    );
};

export default LanguageSwitcher;
