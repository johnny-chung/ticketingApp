import { Ticket } from "../ticket";

it("implement optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "test",
    price: 10,
    userId: "123",
  });
  //save ticket to db
  await ticket.save();
  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make 2 change to fetched tickets
  firstInstance!.set({ title: "first" });
  secondInstance!.set({ title: "second" });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticktet and expect an error
  await expect(secondInstance!.save()).rejects.toThrow();
});

it("increase the version number", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "test",
    price: 10,
    userId: "123",
  });
  //save ticket to db
  await ticket.save();
  expect(ticket.version).toEqual(0);

  // save the ticket again, expect version increased
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
