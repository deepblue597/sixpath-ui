// Base interface with common user fields
export interface UserBase {
  first_name: string;
  last_name: string;
  company?: string;
  sector?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  how_i_know_them?: string;
  when_i_met_them?: string; // TODO: change to Date type
  notes?: string;
}

// Creation of the User of the app (the authenticated owner)
export interface AccountCreate extends UserBase {
  username: string;
  password: string; // Plain text password (will be hashed in service layer)
  is_me?: boolean; // Always true for the account owner
}

// Interface for creating a connection/contact (people in your network)
export interface UserCreate extends UserBase {}

// Interface for updating an existing user
export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  company?: string;
  sector?: string;
  username?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  how_i_know_them?: string;
  when_i_met_them?: string; // TODO: change to Date type
  notes?: string;
}

export interface ConnectionBase {
  person1_id: number;
  person2_id: number;
  relationship?: string; // e.g., "colleague", "friend", etc.
  strength?: number; // e.g., strength of the connection
  context?: string; // Additional context as JSON
  last_interaction?: string; // ISO formatted date string
  notes?: string;
}

export interface ConnectionCreate extends ConnectionBase {}

export interface ConnectionUpdate {
  relationship?: string;
  strength?: number;
  context?: string;
  last_interaction?: string;
  notes?: string;
}

export interface ReferralBase {
  referrer_id: number;
  company?: string;
  position?: string;
  application_date?: string; // ISO formatted date string
  interview_date?: string; // ISO formatted date string
  status?: string; // e.g., "pending", "accepted", "rejected"
  notes?: string;
}

export interface ReferralCreate extends ReferralBase {}

export interface ReferralUpdate {
  company?: string;
  position?: string;
  application_date?: string; // ISO formatted date string
  interview_date?: string; // ISO formatted date string
  status?: string;
  notes?: string;
}
