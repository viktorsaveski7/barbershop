import { Link, useLocation } from 'react-router-dom';
import { Scissors, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Scissors className="h-6 w-6" />
            BarberShop
          </Link>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'mk' : 'en')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-primary-foreground/30 hover:bg-secondary/50 transition-colors"
            >
              {language === 'en' ? 'MK 🇲🇰' : 'EN 🇬🇧'}
            </button>

            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'hover:bg-secondary/50'
              }`}
            >
              {t('nav_home')}
            </Link>
            <Link
              to="/book"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/book'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-accent/80 text-accent-foreground hover:bg-accent'
              }`}
            >
              <Calendar className="h-4 w-4" />
              {t('nav_book')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
