# BarberShop Reservation App

A React + TypeScript barbershop reservation system with Supabase authentication and database.

## Features

- **Authentication**: Sign up, sign in, sign out via Supabase Auth
- **Admin Panel**: Create/delete time slots, view all reservations, cancel bookings
- **User Booking**: Browse available time slots by date, book appointments
- **My Reservations**: View and cancel your own reservations
- **Role-based Access**: Admin vs regular user, enforced in both frontend and DB (RLS)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- React Router v6
- Supabase (Auth + PostgreSQL)
- Lucide React icons
- date-fns

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Settings > API**

### 3. Configure environment

Create a `.env` file (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Make yourself admin

After registering, run in Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### 5. Run the app

```bash
npm run dev
```

## Project Structure

```
src/
├── components/       # Shared components (Navbar, Layout, ProtectedRoute)
├── context/          # AuthContext provider
├── lib/              # Supabase client, types, utilities
├── pages/            # Page components (Login, Register, Admin, Booking, etc.)
├── App.tsx           # Router setup
└── main.tsx          # Entry point
supabase/
└── schema.sql        # Database schema + RLS policies
```
