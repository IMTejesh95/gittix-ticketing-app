import { Message } from "node-nats-streaming";
import { Listner } from "./base-listner";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], message: Message): void {
    console.log("Event data: ", data);
    message.ack();
  }
}
