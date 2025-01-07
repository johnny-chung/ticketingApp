export const stripe = {
  paymentIntents: {
    create: jest.fn().mockRejectedValue({client_secret:"mock-stripe-client-secret"}),
  },
};
