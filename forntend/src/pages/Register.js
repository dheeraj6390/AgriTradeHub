import { useState } from "react";
import api from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");

  const register = async () => {
    try {
      // 1️⃣ Register
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // 2️⃣ Auto Login
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // 3️⃣ Save token + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // 4️⃣ Redirect
      if (res.data.role === "farmer") {
        window.location.href = "/farmer";
      } else {
        window.location.href = "/merchant";
      }
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div style={{ margin: 40 }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="farmer">Farmer</option>
        <option value="merchant">Merchant</option>
      </select>
      <br /><br />

      <button onClick={register}>Register</button>
    </div>
  );
}
