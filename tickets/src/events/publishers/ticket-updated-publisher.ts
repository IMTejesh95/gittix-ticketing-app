import { Publisher, Subjects, TicketUpdatedEvent } from "@tjgittix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
