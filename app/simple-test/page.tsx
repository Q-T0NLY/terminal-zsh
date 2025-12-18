export default function SimpleTest() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Simple Test Page</h1>
      <p>If you can see this, the app is loading correctly.</p>
      <a href="/dashboard" style={{ color: "blue", textDecoration: "underline" }}>
        Go to Dashboard
      </a>
    </div>
  )
}
