//model/Order.ts
import { OrderStatus } from "@goodmanltd/common";
import mongoose, { Types } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
export { OrderStatus };
// replica of Order db in payment service

// interface describe props required to create a new Order
// we will create a replica of order recieved from
interface OrderAttrs {
  id: string;
  userId: string;
  // status or Order used by differet srv -> define it in common lib
  status: OrderStatus;
  price: number;
  version: number;
}

// document = 1 single record
export interface OrderDoc extends mongoose.Document {
  // id include by default
  userId: string;
  status: OrderStatus;
  price: number;
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
    },
    price: {
      type: Number, // cap String as we are refer to a String constructor
      required: true,
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

// need to manually convert id back to _id as mongo need a _id prop or create one
OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: new Types.ObjectId(attrs.id),
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
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
