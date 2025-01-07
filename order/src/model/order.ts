//model/Order.ts
import { OrderStatus } from "@goodmanltd/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
export { OrderStatus };

// interface describe props required to create a new Order
interface OrderAttrs {
  userId: string;
  // status or order used by differet srv -> define it in common lib
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// document = 1 single record
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  // add custom versionKey instead of __v
  version: number;
}

// model = entire collection
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  // find ticket by id and one version before the incoming event data
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // cap String as we are refer to a String constructor
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus), //optional
      required: true,
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    // not the normal approach
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; //other db usually use id instead of _id
        delete ret._id;
      },
    },
    versionKey: "version", // Opts: Custom version key instead of __v
  }
);

OrderSchema.plugin(updateIfCurrentPlugin);

// use this func instead of new Order -> to ensure type checking
// add the buildUser to schema -> so we don't need to rem or export another func
OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

OrderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    // the data from latest event is only one version ahead of record in replica db
    // make sure we don't miss anything in between
    version: event.version - 1,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

// use this func instead of new User -> to ensure type checking
// function buildUser(attrs: UserAttrs) {
//   return new User(attrs);
// }

export { Order };
