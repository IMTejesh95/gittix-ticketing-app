import { Publisher, Subjects, TicketCreatedEvent } from "@tjgittix/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
