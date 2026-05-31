import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { format, addDays } from 'date-fns';
import { LogOut, Plus, Trash2, Calendar, Clock, Users } from 'lucide-react';

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  status: string;
  created_at: string;
  time_slot_id: string;
  time_slots: {
    date: string;
    start_time: string;
    end_time: string;
  };
}

function AdminLogin() {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-foreground mb-6">{t('admin_title')}</h1>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-sm border border-border/50 p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">{t('admin_email')}</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">{t('admin_password')}</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? t('admin_signing_in') : t('admin_signin')}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { signOut } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState<'slots' | 'reservations'>('slots');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newSlotDate, setNewSlotDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newSlotStart, setNewSlotStart] = useState('09:00');
  const [newSlotEnd, setNewSlotEnd] = useState('09:30');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'slots') fetchSlots();
    else fetchReservations();
  }, [tab, selectedDate]);

  const fetchSlots = async () => {
    const { data } = await supabase
      .from('time_slots')
      .select('*')
      .eq('date', selectedDate)
      .order('start_time');
    setSlots((data as TimeSlot[]) || []);
  };

  const fetchReservations = async () => {
    const { data } = await supabase
      .from('reservations')
      .select('*, time_slots(date, start_time, end_time)')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });
    setReservations((data as unknown as Reservation[]) || []);
  };

  const addSlot = async () => {
    setLoading(true);
    await supabase.from('time_slots').insert({
      date: newSlotDate,
      start_time: newSlotStart,
      end_time: newSlotEnd,
      is_booked: false,
    });
    setSelectedDate(newSlotDate);
    await fetchSlots();
    setLoading(false);
  };

  const addBulkSlots = async () => {
    setLoading(true);
    const slotsToInsert = [];
    let hour = 9;
    let min = 0;
    while (hour < 20) {
      const start = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      min += 30;
      if (min >= 60) { hour++; min = 0; }
      const end = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
      slotsToInsert.push({ date: newSlotDate, start_time: start, end_time: end, is_booked: false });
    }
    await supabase.from('time_slots').insert(slotsToInsert);
    setSelectedDate(newSlotDate);
    await fetchSlots();
    setLoading(false);
  };

  const deleteSlot = async (id: string) => {
    await supabase.from('time_slots').delete().eq('id', id);
    await fetchSlots();
  };

  const deleteAllSlots = async () => {
    const unbookedIds = slots.filter(s => !s.is_booked).map(s => s.id);
    if (unbookedIds.length === 0) return;
    await supabase.from('time_slots').delete().in('id', unbookedIds);
    await fetchSlots();
  };

  const cancelReservation = async (id: string, slotId: string) => {
    await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id);
    await supabase.from('time_slots').update({ is_booked: false }).eq('id', slotId);
    await fetchReservations();
  };

  const dateOptions = Array.from({ length: 14 }, (_, i) => format(addDays(new Date(), i), 'yyyy-MM-dd'));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{t('admin_dashboard')}</h1>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('admin_signout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('slots')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'slots' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-foreground'
          }`}
        >
          <Clock className="h-4 w-4" /> {t('admin_tab_slots')}
        </button>
        <button
          onClick={() => setTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'reservations' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50 text-foreground'
          }`}
        >
          <Users className="h-4 w-4" /> {t('admin_tab_reservations')}
        </button>
      </div>

      {tab === 'slots' && (
        <div className="space-y-6">
          {/* Add slots */}
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent" /> {t('admin_add_slots')}
            </h2>

            {/* Manual single slot - clear form layout */}
            <div className="border-2 border-accent/30 rounded-xl p-5 mb-6 bg-accent/5">
              <p className="font-semibold text-foreground mb-4">{t('admin_add_single')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">📅 {t('admin_date')}</label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('admin_start_time')}</label>
                  <input
                    type="time"
                    value={newSlotStart}
                    step="1800"
                    onChange={(e) => {
                      setNewSlotStart(e.target.value);
                      const [h, m] = e.target.value.split(':').map(Number);
                      const totalMin = h * 60 + m + 30;
                      const endH = Math.floor(totalMin / 60) % 24;
                      const endM = totalMin % 60;
                      setNewSlotEnd(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('admin_end_time')}</label>
                  <input
                    type="time"
                    value={newSlotEnd}
                    step="1800"
                    onChange={(e) => setNewSlotEnd(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={addSlot}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent/90 disabled:opacity-50"
                  >
                    ✓ {t('admin_add_slot_btn')}
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted">{t('admin_currently_set')} <strong>{newSlotStart} - {newSlotEnd}</strong> {t('admin_on')} <strong>{newSlotDate}</strong></p>
            </div>

            {/* Bulk actions */}
            <p className="text-sm text-muted mb-3">{t('admin_bulk_title')}</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={addBulkSlots}
                disabled={loading}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 disabled:opacity-50"
              >
                {t('admin_add_full_day')}
              </button>
              <button
                onClick={deleteAllSlots}
                disabled={loading || slots.filter(s => !s.is_booked).length === 0}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                {t('admin_delete_unbooked')}
              </button>
            </div>
          </div>

          {/* Date picker */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dateOptions.map((date) => (
              <button
                key={date}
                onClick={() => { setSelectedDate(date); setNewSlotDate(date); }}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedDate === date
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card border border-border/50 text-foreground hover:border-accent/50'
                }`}
              >
                <div>{format(new Date(date + 'T00:00:00'), 'EEE dd')}</div>
              </button>
            ))}
          </div>

          {/* Slots list */}
          <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              {t('admin_slots_for')} {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMM dd')}
            </h2>
            {slots.length === 0 ? (
              <p className="text-muted text-center py-6">{t('admin_no_slots')}</p>
            ) : (
              <div className="space-y-2">
                {slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 rounded-xl bg-background">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{slot.start_time} – {slot.end_time}</span>
                      {slot.is_booked && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{t('admin_booked')}</span>
                      )}
                    </div>
                    {!slot.is_booked && (
                      <button
                        onClick={() => deleteSlot(slot.id)}
                        className="p-1.5 text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'reservations' && (
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
          <h2 className="text-lg font-semibold mb-4">{t('admin_reservations_title')}</h2>
          {reservations.length === 0 ? (
            <p className="text-muted text-center py-6">{t('admin_no_reservations')}</p>
          ) : (
            <div className="space-y-3">
              {reservations.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-xl bg-background">
                  <div>
                    <div className="font-medium text-foreground">{res.customer_name}</div>
                    <div className="text-sm text-muted">{res.customer_phone}</div>
                    <div className="text-xs text-muted mt-1">
                      {res.time_slots?.date} · {res.time_slots?.start_time} – {res.time_slots?.end_time}
                    </div>
                    {res.notes && <div className="text-xs text-muted mt-1 italic">"{res.notes}"</div>}
                  </div>
                  <button
                    onClick={() => cancelReservation(res.id, res.time_slot_id)}
                    className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    {t('admin_cancel')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return user ? <AdminDashboard /> : <AdminLogin />;
}
