import { Listner, Subjects, TicketUpdatedEvent } from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class TicketUpdatedListner extends Listner<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], message: Message) {
    const ticket = await Ticket.findByEventData(data);
    if (!ticket) throw new Error("Ticket not found!");

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    message.ack();
  }
}
