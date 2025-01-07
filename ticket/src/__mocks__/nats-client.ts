//__mocks__/nats-client.ts

// export a mock natsClient instance
export const natsClient = {
  client: {
    // publish(subject: string, data: string, callback: () => void) {
    //   callback();
    // },

    // mock the publish func as well -> jest will know when it is call, arg passed etc
    // can do some assestion to check if the mock fn has been invoked
    // still need implement to invoke the callback being passed
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
    // remember to reset the mock fn between test -> reset no of call
  },
};
