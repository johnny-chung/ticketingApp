export enum OrderStatus {
  // order created, but ticket is not reserved
  Created = "created",

  // ticket not available -> reserved by others, or
  // user cancel the order, or
  // order expired b4 payment
  Cancelled = "cancelled",

  // order successfully reserved the ticket
  AwaitingPayment = "awaiting:payment",

  // reserved and paid
  Complete = "complete",
}
