import { Link } from 'react-router-dom';
import { Scissors, Calendar, Clock, Star, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();

  const services = [
    { name: t('service_haircut'), price: '€15', duration: t('duration_30'), desc: t('service_haircut_desc') },
    { name: t('service_beard'), price: '€10', duration: t('duration_20'), desc: t('service_beard_desc') },
    { name: t('service_full'), price: '€22', duration: t('duration_45'), desc: t('service_full_desc') },
  ];

  return (
    <div className="space-y-20">
      {/* Hero section */}
      <section className="relative text-center py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl -z-10" />
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-4 bg-accent/10 rounded-2xl">
            <Scissors className="h-14 w-14 text-accent" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-6 tracking-tight">
          {t('hero_title')}
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          {t('hero_subtitle')}
        </p>
        <Link
          to="/book"
          className="inline-flex items-center gap-2 mt-10 px-8 py-4 bg-accent text-accent-foreground rounded-xl font-semibold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
        >
          <Calendar className="h-5 w-5" />
          {t('hero_cta')}
        </Link>
      </section>

      {/* Services */}
      <section>
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">{t('services_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.name} className="group bg-card rounded-2xl shadow-sm border border-border/50 p-8 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-foreground">{service.name}</h3>
                <span className="text-2xl font-bold text-accent">{service.price}</span>
              </div>
              <p className="text-muted text-sm mb-4">{service.desc}</p>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" />
                {service.duration}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">{t('why_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('why_booking_title')}</h3>
            <p className="text-muted text-sm">{t('why_booking_desc')}</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('why_barbers_title')}</h3>
            <p className="text-muted text-sm">{t('why_barbers_desc')}</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('why_wait_title')}</h3>
            <p className="text-muted text-sm">{t('why_wait_desc')}</p>
          </div>
        </div>
      </section>

      {/* Contact / Info */}
      <section className="text-center pb-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">{t('visit_title')}</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            <span>{t('visit_address')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-accent" />
            <span>+389 70 123 456</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <span>{t('visit_hours')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
