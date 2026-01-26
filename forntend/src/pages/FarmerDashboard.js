import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

export default function FarmerDashboard() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const [quality, setQuality] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");

  const token = localStorage.getItem("token");

  const loadProducts = async () => {
    const res = await api.get("/products/mine", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async () => {
    if (!image) {
      alert("Please select image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("quality", quality);
    formData.append("farmerName", farmerName);
    formData.append("contact", contact);
    formData.append("area", area);
    formData.append("district", district);
    formData.append("state", state);

    await api.post("/products", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Product added");

    setName("");
    setPrice("");
    setImage(null);
    setQuality("");
    setFarmerName("");
    setContact("");
    setArea("");
    setDistrict("");
    setState("");

    loadProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadProducts();
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <h2>Farmer Dashboard 🌾</h2>

        <h3>Add Product</h3>

        <input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <br /><br />

        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <br /><br />

        <input placeholder="Quality" value={quality} onChange={(e) => setQuality(e.target.value)} />
        <br /><br />

        <input placeholder="Farmer Name" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} />
        <br /><br />

        <input placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} />
        <br /><br />

        <input placeholder="Area / Village" value={area} onChange={(e) => setArea(e.target.value)} />
        <br /><br />

        <input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
        <br /><br />

        <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
        <br /><br />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <br /><br />

        <button onClick={addProduct}>Add Product</button>

        <hr />

        <h3>My Products</h3>

        {products.map((p) => (
          <div className="card" key={p._id}>
            <img src={p.image} alt="" />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <button className="btn danger" onClick={() => deleteProduct(p._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
