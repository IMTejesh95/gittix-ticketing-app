import Link from "next/link";

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
  await client.get(`/api/payments/success/${order}`);
};

export default PaymentSuccessPage;
