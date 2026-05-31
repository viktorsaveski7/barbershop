import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, CheckCircle, User, Phone, Scissors } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SERVICES = [
  { id: 'haircut', nameKey: 'service_haircut' as const, price: '€15', durationKey: 'duration_30' as const },
  { id: 'beard', nameKey: 'service_beard' as const, price: '€10', durationKey: 'duration_20' as const },
  { id: 'full', nameKey: 'service_full' as const, price: '€22', durationKey: 'duration_45' as const },
];

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export function BookingPage() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  });

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setFetchingSlots(true);
    const { data } = await supabase
      .from('time_slots')
      .select('*')
      .eq('date', selectedDate)
      .eq('is_booked', false)
      .order('start_time');
    setSlots((data as TimeSlot[]) || []);
    setFetchingSlots(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedService || !name || !phone) return;

    setLoading(true);

    // Create reservation
    const { error: resError } = await supabase.from('reservations').insert({
      time_slot_id: selectedSlot.id,
      customer_name: name,
      customer_phone: phone,
      service: selectedService,
      notes: notes || null,
      status: 'confirmed',
    });

    if (!resError) {
      // Mark slot as booked
      await supabase
        .from('time_slots')
        .update({ is_booked: true })
        .eq('id', selectedSlot.id);

      setSuccess(true);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setSuccess(false);
    setSelectedSlot(null);
    setSelectedService(null);
    setName('');
    setPhone('');
    setNotes('');
    fetchAvailableSlots();
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">{t('booking_success_title')}</h1>
        <p className="text-muted text-lg mb-2">
          {t('booking_success_thank')} <span className="font-semibold text-foreground">{name}</span>!
        </p>
        <p className="text-muted mb-8">
          {t('booking_success_appointment')}{' '}
          <span className="font-medium text-foreground">
            {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM dd')}
          </span>{' '}
          {t('booking_success_at')} <span className="font-medium text-foreground">{selectedSlot?.start_time} - {selectedSlot?.end_time}</span>.
          <br />
          {t('booking_success_contact')} <span className="font-medium text-foreground">{phone}</span> {t('booking_success_if_needed')}
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:bg-accent/90 transition-colors"
        >
          {t('booking_another')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('booking_title')}</h1>
        <p className="text-muted mt-2">{t('booking_subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service selection */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Scissors className="h-5 w-5 text-accent" />
            {t('booking_choose_service')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedService === service.id
                    ? 'border-accent bg-accent/5 shadow-sm'
                    : 'border-border/50 hover:border-accent/50'
                }`}
              >
                <div className="font-semibold text-foreground">{t(service.nameKey)}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted">{t(service.durationKey)}</span>
                  <span className="font-bold text-accent">{service.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date selection */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            {t('booking_select_date')}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dateOptions.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedDate === date
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-background text-foreground border border-border/50 hover:border-accent/50'
                }`}
              >
                <div className="text-xs opacity-70">
                  {format(new Date(date + 'T00:00:00'), 'EEE')}
                </div>
                <div className="font-semibold">{format(new Date(date + 'T00:00:00'), 'dd')}</div>
                <div className="text-xs opacity-70">{format(new Date(date + 'T00:00:00'), 'MMM')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            {t('booking_pick_time')}
          </h2>
          {fetchingSlots ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
            </div>
          ) : slots.length === 0 ? (
            <p className="text-muted text-center py-8">
              {t('booking_no_slots')}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedSlot?.id === slot.id
                      ? 'bg-accent text-accent-foreground shadow-md'
                      : 'bg-background text-foreground border border-border/50 hover:border-accent/50'
                  }`}
                >
                  {slot.start_time} - {slot.end_time}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            {t('booking_your_details')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                {t('booking_full_name')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                {t('booking_phone')} *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+389 70 123 456"
                  className="w-full pl-10 pr-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1.5">
              {t('booking_notes')}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('booking_notes_placeholder')}
              className="w-full px-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none transition-all"
              rows={3}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !selectedSlot || !selectedService || !name || !phone}
          className="w-full py-4 bg-accent text-accent-foreground rounded-xl font-semibold text-lg hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? t('booking_loading') : t('booking_confirm')}
        </button>
      </form>
    </div>
  );
}
