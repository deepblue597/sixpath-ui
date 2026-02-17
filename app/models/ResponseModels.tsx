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
  relationship?: string;
  strength?: number;
  context?: string;
  last_interaction?: Date;
  notes?: string;
  created_at: Date;
  updated_at?: Date;
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
