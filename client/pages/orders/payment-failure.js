import Link from "next/link";
const PaymentFailurePage = () => {
  return (
    <div>
      <h2 style={{ color: "red" }}> Payment Failed to Process</h2>
      <Link href="/">
        <a>Go back to Homepage</a>
      </Link>
    </div>
  );
};

PaymentFailurePage.getInitialProps = async (context, client) => {
  const { order } = context.query;
  await client.delete(`/api/payments/${order}`);
};

export default PaymentFailurePage;