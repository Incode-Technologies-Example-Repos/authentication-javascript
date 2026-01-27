import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Success from "./Success";

const apiURL = import.meta.env.VITE_API_URL;
const clientId = import.meta.env.VITE_CLIENT_ID; // for 1:N if needed
const apiKey = import.meta.env.VITE_API_KEY;    

function App() {
  const loginStartRef = useRef(null);
  const [onBoarding, setOnBoarding] = useState(null);
  const [identityId, setIdentityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Warming up SDK...");
  const navigate = useNavigate();

  function finish(customerId, email, interviewToken) {
    const end = performance.now();
    const durationMs = end - loginStartRef.current;
    const container = document.getElementById("incode-container");
    if (container) container.innerHTML = "";

    navigate("/success", {
    state: {
      customerId,
      email,
      durationMs,
    },
  });
    console.log(`✅ Login completed in ${durationMs.toFixed(2)} ms`);
    console.log(`⏱️ Login duration (seconds): ${(durationMs / 1000).toFixed(2)}s`);
    console.log("✅ FINISH", { customerId, email, interviewToken });
    setStatusMessage(`Authenticated in ${(durationMs / 1000).toFixed(2)}s ${email || customerId}`);
  }

  function showError(err) {
    console.error(err);
    setStatusMessage(err?.message || "Unexpected error");
  }

  async function getIncodeStatusValidation(response) {
    const { token, transactionId, interviewToken, faceMatch, customerId, email } = response
      if (faceMatch) {
        const response = await fetch('backend/verify',
          {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ token, transactionId, interviewToken })
          }
        )
        const verification = await response.json()
        console.log('VERIFICATION', verification)
        if (verification.verified === true) {
          finish(customerId, email, interviewToken)
        } else {
          showError(new Error('FaceMatch is invalid.'))
        }
      } else {
        showError(new Error('Face did not match any user.'))
      }
  }

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const instance = window.OnBoarding.create({
          apiURL,
          clientId,
          apiKey,
        });

        if (!isMounted) return;

        setStatusMessage("Warming up SDK...");
        await instance.warmup();

        if (!isMounted) return;
        setOnBoarding(instance);
        setStatusMessage(""); // ready
      } catch (err) {
        console.error("Error initializing OnBoarding:", err);
        if (isMounted) {
          setStatusMessage("Error initializing SDK");
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!onBoarding) return;
    // NOTE: uncomment this line when using 1:1
    // if (!identityId) {
    //   setStatusMessage("Please enter an Employee ID");
    //   return;
    // }

    loginStartRef.current = performance.now();
    console.log("⏱️ Login started");

    setLoading(true);
    setStatusMessage("Starting authentication...");

    const container = document.getElementById("incode-container");

    try {
      onBoarding.renderLogin(container, {
        isOneToOne: false, //set to true when 1:1
        lensesCheckEnabled: false,
        maskCheckEnabled: false,
        hatCheckEnabled: false,
        eyesClosedCheckEnabled: false,
        //NOTE uncomment this line when 1:1
        // oneToOneProps: {
        //   identityId,
        // },
        onSuccess: async (response) => {
          try {
            if (response.faceMatch) {
              setStatusMessage("Face match successful, validating...");
              await getIncodeStatusValidation(response);
            } else {
              setStatusMessage("Face does not match, please try again.");
            }
          } catch (err) {
            console.error(err);
            setStatusMessage("There was an error validating the user.");
          } finally {
            setLoading(false);
          }
        },
        onError: (err) => {
          console.error("renderLogin error:", err);
          setStatusMessage("There was an error starting login.");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("renderLogin threw:", err);
      setStatusMessage("There was an error starting login.");
      setLoading(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app-container">
            <h1>Face Authentication</h1>

            <form className="login-form" onSubmit={handleLogin}>
              
              <button type="submit" >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>
            <div id="incode-container" />

            {statusMessage && <p className="status">{statusMessage}</p>}
          </div>
        }
      />

      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
