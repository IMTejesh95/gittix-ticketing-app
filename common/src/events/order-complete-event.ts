import { Subjects } from "./subjects";

export interface OrderCompleteEvent {
  subject: Subjects.OrderComplete;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
