import { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import './login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const clientId = "677219864654-vut2tlu52rsn8jjbvv4lg3mk2544uvmp.apps.googleusercontent.com";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
    const data = isLogin
      ? { email, password }
      : { email, password, confirmPassword };

    try {
      const res = await axios.post(url, data);
      setMessage(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/google-login", {
        token: credentialResponse.credential,
      });
      setMessage(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      setMessage("Google login failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleGoogleFailure = () => {
    setMessage("Google login was cancelled or failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {/* Floating glassy shapes */}
      <div className="floating-elements">
        <div className="floating-element" style={{ top: "10%", left: "5%" }}></div>
        <div className="floating-element" style={{ top: "40%", left: "70%" }}></div>
        <div className="floating-element" style={{ top: "70%", left: "30%" }}></div>
       
      </div>

      {/* Auth form container with glassmorphism */}
      <div className="auth-container">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <br />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <div className="or-divider">OR</div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />

        <p className="message">{message}</p>

        <p className="toggle-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
