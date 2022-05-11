import Link from "next/link";
import router from "next/router";

const PaymentSuccessPage = () => {
  return (
    <div>
      <h2 style={{ color: "green" }}> Payment Succeeded!</h2>
      <Link href="/">
        <a>Go back to Homepage</a>
      </Link>
    </div>
  );
};

PaymentSuccessPage.getInitialProps = async (context, client) => {
  const { order } = context.query;
  const resp = await client.get(`/api/payments/success/${order}`);
  if (resp.status === 200) router.push("/orders");
  else router.push("/orders/[orderId]", `/orders/${order}`);
};

export default PaymentSuccessPage;
