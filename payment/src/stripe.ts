// src/stripe.ts
import Stripe from "stripe";

// a class
// args: 
//  api key
//  obj with apiVersion -> auto complete
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2024-12-18.acacia",
});
