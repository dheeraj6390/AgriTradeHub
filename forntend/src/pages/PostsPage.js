import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function PostsPage() {
  const [products, setProducts] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [activeDetails, setActiveDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const showReviews = async (id) => {
    if (activeReview === id) {
      setActiveReview(null);
      return;
    }
    const res = await api.get(`/reviews/${id}`);
    setReviews(res.data);
    setActiveReview(id);
  };

  const showDetails = (id) => {
    setActiveDetails(activeDetails === id ? null : id);
  };

  const orderProduct = async (id) => {
    await api.post(
      "/orders",
      { productId: id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Order placed");
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <h2>All Products</h2>

        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              <img src={p.image} alt="" />
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>

              {/* BUTTONS ALWAYS VISIBLE */}
              <div style={{ marginBottom: 10 }}>
                {role === "merchant" && (
                  <button className="btn" onClick={() => orderProduct(p._id)}>
                    Order
                  </button>
                )}

                <button
                  className="btn secondary"
                  onClick={() => showReviews(p._id)}
                >
                  Review
                </button>

                <button
                  className="btn secondary"
                  onClick={() => showDetails(p._id)}
                >
                  Details
                </button>
              </div>

              {/* REVIEWS */}
              {activeReview === p._id && (
                <div className="review-panel">
                  <h4>⭐ Reviews</h4>
                  {reviews.length === 0 && <p>No reviews yet</p>}
                  {reviews.map((r) => (
                    <div key={r._id}>
                      ⭐ {r.rating} – {r.comment}
                    </div>
                  ))}
                </div>
              )}

              {/* DETAILS */}
              {activeDetails === p._id && (
                <div className="review-panel">
                  <h4>👨‍🌾 Farmer Details</h4>
                  <p><b>Farmer:</b> {p.farmerName}</p>
                  <p><b>Quality:</b> {p.quality}</p>
                  <p>
                    <b>Location:</b> {p.area}, {p.district}, {p.state}
                  </p>

                  {role === "merchant" && (
                    <p><b>Contact:</b> {p.contact}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
