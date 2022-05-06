import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = await Ticket.build({
    title: "ticket 1",
    price: 10,
    userId: "d92mje0m2",
  });
  await ticket.save();

  const firstTkt = await Ticket.findById(ticket.id);
  const secondTkt = await Ticket.findById(ticket.id);

  firstTkt!.set({ price: 50 });
  secondTkt!.set({ price: 13 });

  await firstTkt!.save();

  await expect(secondTkt!.save()).rejects.toThrowError();
});

it("increments the version number on multiple saves", async () => {
  const ticket = await Ticket.build({
    title: "ticket 1",
    price: 10,
    userId: "d92mje0m2",
  });
  await ticket.save();

  expect(ticket.version).toBe(0);
  await ticket.save();
  expect(ticket.version).toBe(1);
  await ticket.save();
  expect(ticket.version).toBe(2);
});
