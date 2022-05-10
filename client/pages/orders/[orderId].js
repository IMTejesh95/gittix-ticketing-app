import { useState, useEffect } from "react";
import useRequest from "../../hooks/use-request";
import router from "next/router";

const ShowOrder = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => router.push(payment.redirect_url),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return (
      <div>
        <h2 style={{ color: "red" }}>Order Expired!</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Purchase Order for - {order.ticket.title}</h1>
      <h3>Time left to pay: {timeLeft} seconds</h3>

      {/* <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey=""
        amount={parseFloat(order.ticket.price * 100)}
        email={currentUser.email}
      /> */}
      {errors}
      <button onClick={() => doRequest()} className="btn btn-success mt-3">
        Pay &#8377; {order.ticket.price}
      </button>
    </div>
  );
};

ShowOrder.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default ShowOrder;
