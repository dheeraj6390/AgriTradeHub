import api from "../api";

export default function Login() {
  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: "ram@gmail.com",
        password: "123456",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name); // 🔴 IMPORTANT

      window.location.href = "/";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ marginTop: 120, textAlign: "center" }}>
      <h2>Login</h2>
      <button onClick={login}>Login</button>
    </div>
  );
}
