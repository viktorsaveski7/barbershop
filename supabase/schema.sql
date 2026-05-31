-- Barbershop Booking System Schema
-- Run this in your Supabase SQL Editor

-- Time slots table (managed by admin)
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations table (created by customers)
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  time_slot_id UUID REFERENCES time_slots(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Time slots policies
-- Anyone can read available time slots
CREATE POLICY "Anyone can view time slots"
  ON time_slots FOR SELECT
  USING (true);

-- Only authenticated users (admin) can insert/update/delete time slots
CREATE POLICY "Admin can insert time slots"
  ON time_slots FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update time slots"
  ON time_slots FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can delete time slots"
  ON time_slots FOR DELETE
  TO authenticated
  USING (true);

-- Reservations policies
-- Anyone can insert a reservation (no auth required for booking)
CREATE POLICY "Anyone can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (true);

-- Anyone can read reservations (needed to mark slots as booked)
-- In production, you might want to restrict this
CREATE POLICY "Anyone can view reservations"
  ON reservations FOR SELECT
  USING (true);

-- Only authenticated users (admin) can update/delete reservations
CREATE POLICY "Admin can update reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can delete reservations"
  ON reservations FOR DELETE
  TO authenticated
  USING (true);

-- Also allow anonymous users to update time_slots.is_booked when booking
CREATE POLICY "Anyone can update time slot booking status"
  ON time_slots FOR UPDATE
  USING (true);
