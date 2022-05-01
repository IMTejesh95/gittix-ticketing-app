import mongo from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDoc extends mongo.Document {
  title: string;
  price: number;
  userId: string;
}

interface TickerModel extends mongo.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongo.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongo.model<TicketDoc, TickerModel>("Ticket", ticketSchema);

export { Ticket };
