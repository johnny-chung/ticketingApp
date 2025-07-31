import { Subjects } from "./subjects";

export interface ChargeCreatedEvent {
  subject: Subjects.ChargeCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
