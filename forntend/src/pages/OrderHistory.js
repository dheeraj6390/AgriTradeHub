import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/orders/my", {
        headers: { authorization: localStorage.getItem("token") },
      })
      .then((res) => setOrders(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ margin: 40 }}>
        <h2>My Orders 🧾</h2>

        {orders.length === 0 && <p>No orders yet</p>}

        {orders.map((o) => (
          <div
            key={o._id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <h4>{o.product?.name}</h4>
            <p>Price: ₹{o.product?.price}</p>
            <p>Quantity: {o.quantity}</p>
            <p>Date: {new Date(o.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}
