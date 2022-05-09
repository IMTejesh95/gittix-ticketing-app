import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Payment } from "../../models/payment";

it("checks if order exist else return 404", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signup())
    .send({
      token: "dj29d2d2u29md",
      orderId: generateMongoId(),
    })
    .expect(404);
});

it("throws 401 if user does not own the order", async () => {
  const order = Order.build({
    id: generateMongoId(),
    userId: "dj20d3j",
    status: OrderStatus.Created,
    price: 31,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup())
    .send({
      token: "dj29d2d2u29md",
      orderId: order.id,
    })
    .expect(401);
});

it("doesn't allow payments for cancelled order, throws 400", async () => {
  const userId = generateMongoId();
  const order = Order.build({
    id: generateMongoId(),
    userId: userId,
    status: OrderStatus.Cancelled,
    price: 31,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(userId))
    .send({
      token: "dj29d2d2u29md",
      orderId: order.id,
    })
    .expect(400);
});

it("creates a charge for order", async () => {
  const userId = generateMongoId();
  const order = Order.build({
    id: generateMongoId(),
    userId: userId,
    status: OrderStatus.Created,
    price: 16,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const payment = await Payment.findOne({
    orderId: order.id,
  });

  expect(payment!).not.toBeNull();
  expect(payment!.stripeId).not.toBeNull();
});