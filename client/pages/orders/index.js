import Link from "next/link";

const ListOrders = ({ orders }) => {
  return (
    <div>
      <h1>My Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td>
                {order.status == "created"
                  ? "Awaiting Payment"
                  : order.status.toUpperCase()}
              </td>
              <td> &#8377; {order.ticket.price}</td>
              <td>
                <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
                  <a>Details</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ListOrders.getInitialProps = async (_context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default ListOrders;
