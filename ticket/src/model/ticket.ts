//model/ticket.ts

import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// interface describe props required to create a new ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// document = 1 single record
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  // add custom versionKey instead of __v
  version: number;
}

// model = entire collection
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String, // cap String as we are refer to a String constructor
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
    orderId: {
      type: String,
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

ticketSchema.plugin(updateIfCurrentPlugin);

// use this func instead of new Ticket -> to ensure type checking
// add the buildUser to schema -> so we don't need to rem or export another func
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

// use this func instead of new User -> to ensure type checking
// function buildUser(attrs: UserAttrs) {
//   return new User(attrs);
// }

export { Ticket };
