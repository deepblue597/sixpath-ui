import { UserBase } from "./InputModels";

export interface UserResponse extends UserBase {
  id: number;
  is_me: boolean;
  username: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface ConnectionResponse {
  id: number;
  person1_id: number;
  person2_id: number;
  relationship: string | null;
  strength: number | null;
  context: string | null;
  last_interaction: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface ReferralResponse {
  id: number;
  referrer_id: number;
  company: string | null;
  position: string | null;
  application_date: Date | null;
  interview_date: Date | null;
  status: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date | null;
}
