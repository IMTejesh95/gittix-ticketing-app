import { OrderStatus } from "@tjgittix/common";
import mongo from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

export interface OrderDoc extends mongo.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

interface OrderModel extends mongo.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEventData(event: {
    id: string;
    version: number;
  }): Promise<OrderDoc | null>;
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
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findByEventData = (eventData: {
  id: string;
  version: number;
}) => {
  return Order.findOne({
    _id: eventData.id,
    version: eventData.version - 1,
  });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    status: attrs.status,
    price: attrs.price,
  });
};

const Order = mongo.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };
