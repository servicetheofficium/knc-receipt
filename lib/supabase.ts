import { createClient } from "@supabase/supabase-js";

export type ReceiptItem = {
  name: string;
  amount: number;
};

export type Receipt = {
  id: string;
  receipt_no: string;
  date: string;
  staff: string;
  student_name: string;
  course: string;
  parent_name: string;
  parent_phone: string;
  parent_address: string;
  items: ReceiptItem[];
  total: number;
  payment_method: string;
  paid_amount: number;
  change_amount: number;
  created_at: string;
  updated_at: string;
};

export type ReceiptInsert = Omit<Receipt, "id" | "receipt_no" | "created_at" | "updated_at">;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
