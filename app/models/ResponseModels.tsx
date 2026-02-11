import { UserBase } from "./InputModels";

export interface UserResponse extends UserBase {
  id: number;
  is_me: boolean;
  username: string;
  created_at: Date;
  updated_at: Date;
}
