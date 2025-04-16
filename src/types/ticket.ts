export interface Ticket {
  id?: number;
  property_id: number;
  property_name?: string;
  user_name: string;
  email: string; // Added required email field
  question: string;
  created_at?: string;
}
