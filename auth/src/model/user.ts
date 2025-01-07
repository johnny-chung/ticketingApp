//model/user.ts

import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

// interface describe props required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// interface describe props that props user model has
// model = entire collection
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface describe props that user doc has
// document = 1 single record
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String, // cap String as we are refer to a String constructor
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // not the normal approach
    toJSON: {
      transform(doc, ret) {
        // ret the return doc after mongoose transform, we change it directly
        delete ret.password; //normal js -> del a keyword of an obj
        delete ret.__v; // version key
        ret.id = ret._id;  //other db usually use id instead of _id
        delete ret._id;
      },
    },
  }
);

// middleware available from mongoose
// mongoose don't deal with await -> we need to tell that it is done
// can't use arrow function: with function keyword -> this refer to UserDoc
// arrow function -> this refer to this file
userSchema.pre("save", async function (done) {
  // check if password is modified
  // for later password changing func in the app
  // this is also consider true my mongoose when first create
  if (this.isModified("password")) {
    const hased = await PasswordManager.toHash(this.get("password"));
    //console.log(hased);
    this.set("password", hased);
  }
  done();
});

// use this func instead of new User -> to ensure type checking
// add the buildUser to schema -> so we don't need to rem or export another func
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// use this func instead of new User -> to ensure type checking
// function buildUser(attrs: UserAttrs) {
//   return new User(attrs);
// }

export { User };
