import Link from "next/link";
const FailurePage = () => {
  return (
    <div>
      <h2 style={{ color: "red" }}> Payment Failed to Process</h2>
      <Link href="/">
        <a>Go back to Homepage</a>
      </Link>
    </div>
  );
};

FailurePage.getInitialProps = async (context, client) => {
  console.log(context.query);
  // Call backend to mark order payment as failed and release the ticket
};
