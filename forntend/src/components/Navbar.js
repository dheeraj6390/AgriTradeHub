export default function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav>
      <a href="/">Posts</a>

      {!token && (
        <>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
        </>
      )}

      {token && (
        <>
          <span style={{ marginLeft: 20, fontWeight: "bold" }}>
            {role?.toUpperCase()} – {name}
          </span>

          <button style={{ marginLeft: 20 }} onClick={logout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
