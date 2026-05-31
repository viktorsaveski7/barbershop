export type Database = {
  public: {
    Tables: {
      time_slots: {
        Row: {
          id: string;
          date: string;
          start_time: string;
          end_time: string;
          is_booked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          start_time: string;
          end_time: string;
          is_booked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          is_booked?: boolean;
          created_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          time_slot_id: string;
          customer_name: string;
          customer_phone: string;
          service: string;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          time_slot_id: string;
          customer_name: string;
          customer_phone: string;
          service: string;
          notes?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          time_slot_id?: string;
          customer_name?: string;
          customer_phone?: string;
          service?: string;
          notes?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
