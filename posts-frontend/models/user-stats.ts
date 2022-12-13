import { Frequency } from "./frequency";

export interface UserStats {
  userId: string;
  userName: string;
  totalCount: number;
  averageLength: number;
  minLength: number;
  maxLength: number;
  frequencies: Frequency[];
}