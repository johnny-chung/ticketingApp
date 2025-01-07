//order/model/ticket.ts

// a replica of the Ticket db from ticket service

import mongoose, { Types } from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// interface describe props required to create a new ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// document = 1 single record
// need to export this as used in Order model
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  // custom method
  isReserved(): Promise<boolean>;
}

// model = entire collection
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  // find ticket by id and one version before the incoming event data
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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
      min: 0,
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

//ticketSchema.plugin(updateIfCurrentPlugin);

// a middleware before save
// callback of middleware must have function keyword
// done must be called
ticketSchema.pre("save", function (done) {
  // mongoose default -> findById and save
  // this.$where -> add additional condition
  // here -> also need record version to = passed data version - 1
  this.$where = { version: this.get("version") - 1 };
  done();
});

// statics -> attach to model -> all same

// method -> attach to instance

// use this func instead of new Ticket -> to ensure type checking
// add the buildUser to schema -> so we don't need to rem or export another func
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  // manually reassign id to _id
  return new Ticket({
    _id: new Types.ObjectId(attrs.id), // cast to ObjectId for typechecking my mongoose
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    // the data from latest event is only one version ahead of record in replica db
    // make sure we don't miss anything in between
    version: event.version - 1,
  });
};

// methods -> add new custom method
// must use function keywords
ticketSchema.methods.isReserved = async function () {
  // this = the ticket doc we just called isReserved
  // arrow func -> this keyword become unclear -> use function keyword

  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  //console.log(existingOrder);
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

// use this func instead of new User -> to ensure type checking
// function buildUser(attrs: UserAttrs) {
//   return new User(attrs);
// }

export { Ticket };
