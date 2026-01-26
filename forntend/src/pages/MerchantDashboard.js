import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function MerchantDashboard() {
  const [products, setProducts] = useState([]);

  // review inputs
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  // load products
  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  // order product
  const orderProduct = async (productId) => {
    await api.post(
      "/orders",
      { productId, quantity: 1 },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Order placed successfully 🛒");
  };

  // add review
  const addReview = async (productId) => {
    if (!comment) {
      alert("Please write a review");
      return;
    }

    await api.post(
      "/reviews",
      {
        productId,
        rating,
        comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Review added successfully ⭐");
    setComment("");
    setRating(5);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ margin: 40 }}>
        <h2>Merchant Dashboard 🛒</h2>

        {products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 25,
            }}
          >
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <img src={p.image} alt="" width="120" />
            <br /><br />

            {/* ORDER BUTTON */}
            <button onClick={() => orderProduct(p._id)}>
              Order Product
            </button>

            <hr />

            {/* REVIEW INPUT */}
            <h5>Add Review</h5>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>

            <br /><br />

            <textarea
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              style={{ width: "100%" }}
            />

            <br /><br />

            <button onClick={() => addReview(p._id)}>
              Submit Review
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
