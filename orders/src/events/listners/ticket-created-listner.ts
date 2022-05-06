import { Listner, Subjects, TicketCreatedEvent } from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: TicketCreatedEvent["data"], message: Message) {
    console.log("TicketCreatedListner::TicketCreatedEvent ", data);

    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    message.ack();
  }
}
