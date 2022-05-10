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
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td
                style={{
                  color: order.status === "completed" ? "red" : "green",
                }}
              >
                {order.status}
              </td>
              <td> &#8377; {order.ticket.price}</td>
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
