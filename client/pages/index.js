import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td> &#8377; {ticket.price}</td>
              <td>
                <Link href={"/tickets/[ticketId]"} as={`/tickets/${ticket.id}`}>
                  <a>View</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (_context, client, _currentUser) => {
  console.log("LandingPage getInitialProps!");

  const { data } = await client.get("/api/tickets");

  return {
    tickets: data,
  };
};

export default LandingPage;
