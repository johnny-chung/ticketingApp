import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderDoc } from "./order";

interface PaymentAttrs {
  orderId: string;
  paymentIntentId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  paymentIntentId: string;
  version: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
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

// PaymentSchema.plugin(updateIfCurrentPlugin);

// need to manually convert id back to _id as mongo need a _id prop or create one
PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  PaymentSchema
);

export { Payment };
