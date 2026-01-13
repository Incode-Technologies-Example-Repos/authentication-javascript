import { useLocation, useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="app-container">
        <h1>No authentication data</h1>
        <button onClick={() => navigate("/")}>Go back</button>
      </div>
    );
  }

  const { customerId, email, interviewToken, durationMs } = state;

  return (
    <div className="app-container">
      <h1>✅ Authentication Successful</h1>

      <div className="result-block">
        <p>
          <strong>User:</strong> {email || customerId}
        </p>

        <p>
          <strong>Customer ID:</strong> {customerId}
        </p>

        <p>
          <strong>Login completed in:</strong>{" "}
          {durationMs.toFixed(2)} ms
        </p>

        <p>
          <strong>Login duration:</strong>{" "}
          {(durationMs / 1000).toFixed(2)} seconds
        </p>
      </div>

      <button style={{ marginTop: "1.5rem" }} onClick={() => navigate("/")}>
        Logout / Try again
      </button>
    </div>
  );
}
