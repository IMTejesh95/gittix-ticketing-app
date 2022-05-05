import { OrderStatus } from "@tjgittix/common";
import mongo from "mongoose";
import { TicketDoc } from "./ticket";

interface OrderAttrs {
  userId: string;
  status?: OrderStatus;
  expiresAt?: Date;
  ticket: TicketDoc;
}

export interface OrderDoc extends mongo.Document {
  userId: string;
  status?: string;
  expiresAt?: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongo.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongo.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongo.Schema.Types.Date,
    },
    ticket: {
      type: mongo.Schema.Types.ObjectId,
      ref: "Ticket",
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongo.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };
