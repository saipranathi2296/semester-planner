 /*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import './login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [titleKey, setTitleKey] = useState(0);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(() => {
    // Initialize with some dummy users for demonstration
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [
      { email: 'user@example.com', password: 'password123', name: 'Demo User' }
    ];
  });
  const navigate = useNavigate();

  // Save users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const toggleMode = () => {
    if (isAnimating) return;
    setError(null);
    setIsAnimating(true);
    setTitleKey((prevKey) => prevKey + 1);
    setTimeout(() => {
      setIsSignup((prev) => !prev);
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (isSignup) {
      // Sign up logic
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      const userExists = users.some(user => user.email === email);
      if (userExists) {
        setError("User already exists with this email");
        return;
      }

      const newUser = {
        name: email.split('@')[0], // Simple way to create a name from email
        email,
        password // Note: In a real app, you would hash the password
      };

      setUsers([...users, newUser]);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      triggerCelebration();
    } else {
      // Login logic
      const user = users.find(user => user.email === email);
      
      if (!user) {
        setError("No account found with this email");
        return;
      }

      if (user.password !== password) {
        setError("Incorrect password");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    document.body.classList.add("celebrate");
    setTimeout(() => {
      document.body.classList.remove("celebrate");
      navigate("/dashboard");
    }, 1500);
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google login successful:", credentialResponse);

    // Extract user info from Google response (in a real app, you would verify the token)
    const user = {
      name: "Google User",
      email: "google@example.com",
      isGoogleUser: true
    };

    // Check if user exists, if not add them
    const userExists = users.some(u => u.email === user.email);
    if (!userExists) {
      setUsers([...users, user]);
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    triggerCelebration();
  };

  const handleGoogleLoginError = () => {
    console.log("Google login failed");
    setError("Google login failed. Please try again.");
    const authContainer = document.querySelector(".auth-container");
    authContainer.classList.add("shake");
    setTimeout(() => authContainer.classList.remove("shake"), 500);
  };

  // Background animation effect
  useEffect(() => {
    const colors = ["#ff9a9e", "#fad0c4", "#fbc2eb", "#a6c1ee", "#a1c4fd"];
    let currentIndex = 0;

    const changeBackground = () => {
      document.body.style.background = `linear-gradient(45deg, ${
        colors[currentIndex]
      }, ${colors[(currentIndex + 2) % colors.length]})`;
      currentIndex = (currentIndex + 1) % colors.length;
    };

    const interval = setInterval(changeBackground, 8000);
    changeBackground();

    return () => clearInterval(interval);
  }, []);

  return (
    <GoogleOAuthProvider clientId="677219864654-vut2tlu52rsn8jjbvv4lg3mk2544uvmp.apps.googleusercontent.com">
      <div className="background-light"></div>

      <div
        className={`auth-container ${
          isAnimating ? "container-transition" : ""
        }`}
      >
        <div
          key={titleKey}
          className={`title ${
            isAnimating ? (isSignup ? "title-exit" : "title-enter") : ""
          }`}
        >
          {isSignup ? "Create Account" : "Welcome Back"}
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button className="error-close" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        <form className="form-container" onSubmit={handleSubmit}>
          <div
            className={`input-container ${activeInput === 0 ? "active" : ""}`}
            onMouseEnter={() => !activeInput && setActiveInput(0)}
            onMouseLeave={() => activeInput === 0 && setActiveInput(null)}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              required
              onFocus={() => setActiveInput(0)}
              onBlur={() => setActiveInput(null)}
            />
            <div className="input-highlight"></div>
          </div>

          <div
            className={`input-container ${activeInput === 1 ? "active" : ""}`}
            onMouseEnter={() => !activeInput && setActiveInput(1)}
            onMouseLeave={() => activeInput === 1 && setActiveInput(null)}
          >
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              required
              onFocus={() => setActiveInput(1)}
              onBlur={() => setActiveInput(null)}
            />
            <div className="input-highlight"></div>
          </div>

          <div
            className={`input-container confirm-password ${
              isSignup ? "show" : "hide"
            }`}
            onMouseEnter={() => !activeInput && isSignup && setActiveInput(2)}
            onMouseLeave={() => activeInput === 2 && setActiveInput(null)}
          >
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input-field"
              required={isSignup}
              onFocus={() => setActiveInput(2)}
              onBlur={() => setActiveInput(null)}
            />
            <div className="input-highlight"></div>
          </div>

          <button
            type="submit"
            className={`btn ${isSignup ? "puffy-btn" : "soft-btn"}`}
          >
            {isSignup ? "Sign Up" : "Login"}
            <span className="btn-glow"></span>
          </button>
        </form>

        <div className="or-divider">
          <div className="divider-line"></div>
          <span>or</span>
          <div className="divider-line"></div>
        </div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            shape="pill"
            theme="filled_blue"
            size="large"
            text={isSignup ? "signup_with" : "continue_with"}
          />
        </div>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="toggle-link" onClick={toggleMode}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>

     
      <div className="floating-elements">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
*/
// App.js
 /*import { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import './login.css';

export default function AuthForm() {
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
      <div>
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

        <p>OR</p>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />

        <p>{message}</p>

        <p>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}
*/
import { useState, useEffect } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const navigate = useNavigate();

  const clientId = "677219864654-vut2tlu52rsn8jjbvv4lg3mk2544uvmp.apps.googleusercontent.com";

  // Background animation effect
  useEffect(() => {
    const colors = [
      "#fad0c4", "#fbc2eb", "#a6c1ee"
    ];
    let currentIndex = 0;

    const changeBackground = () => {
      const nextIndex = (currentIndex + 1) % colors.length;
      document.body.style.background = 
        `linear-gradient(45deg, ${colors[currentIndex]}, ${colors[nextIndex]})`;
      currentIndex = nextIndex;
    };

    const interval = setInterval(changeBackground, 5000);
    changeBackground(); // Initial call

    return () => clearInterval(interval);
  }, []);

  const toggleMode = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
    const data = isLogin
      ? { email, password }
      : { email, password, confirmPassword };

    try {
      const res = await axios.post(url, data);
      setMessage(res.data.message);
      triggerCelebration();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
      const authContainer = document.querySelector(".auth-container");
      authContainer.classList.add("shake");
      setTimeout(() => authContainer.classList.remove("shake"), 500);
    }
  };

  const triggerCelebration = () => {
    document.body.classList.add("celebrate");
    setTimeout(() => {
      document.body.classList.remove("celebrate");
      navigate("/dashboard");
    }, 1500);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/google-login", {
        token: credentialResponse.credential,
      });
      setMessage(res.data.message);
      triggerCelebration();
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      setMessage("Google login failed: " + (err.response?.data?.message || err.message));
      const authContainer = document.querySelector(".auth-container");
      authContainer.classList.add("shake");
      setTimeout(() => authContainer.classList.remove("shake"), 500);
    }
  };

  const handleGoogleFailure = () => {
    setMessage("Google login was cancelled or failed");
    const authContainer = document.querySelector(".auth-container");
    authContainer.classList.add("shake");
    setTimeout(() => authContainer.classList.remove("shake"), 500);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="background-light"></div>
      
      <div className={`auth-container ${isAnimating ? "container-transition" : ""}`}>
        <h2 className={`title ${isAnimating ? (isLogin ? "title-enter" : "title-exit") : ""}`}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {message && (
          <div className="error-message">
            {message}
            <button className="error-close" onClick={() => setMessage("")}>
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-container">
          <div 
            className={`input-container ${activeInput === 0 ? "active" : ""}`}
            onMouseEnter={() => !activeInput && setActiveInput(0)}
            onMouseLeave={() => activeInput === 0 && setActiveInput(null)}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onFocus={() => setActiveInput(0)}
              onBlur={() => setActiveInput(null)}
            />
            <div className="input-highlight"></div>
          </div>

          <div 
            className={`input-container ${activeInput === 1 ? "active" : ""}`}
            onMouseEnter={() => !activeInput && setActiveInput(1)}
            onMouseLeave={() => activeInput === 1 && setActiveInput(null)}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              onFocus={() => setActiveInput(1)}
              onBlur={() => setActiveInput(null)}
            />
            <div className="input-highlight"></div>
          </div>

          <div 
            className={`input-container confirm-password ${!isLogin ? "show" : "hide"}`}
            onMouseEnter={() => !activeInput && !isLogin && setActiveInput(2)}
            onMouseLeave={() => activeInput === 2 && setActiveInput(null)}
          >
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isLogin}
              onFocus={() => setActiveInput(2)}
              onBlur={() => setActiveInput(null)}
            />
            <div className="input-highlight"></div>
          </div>

          <button type="submit" className={`btn ${!isLogin ? "puffy-btn" : "soft-btn"}`}>
            {isLogin ? "Login" : "Sign Up"}
            <span className="btn-glow"></span>
          </button>
        </form>

        <div className="or-divider">
          <div className="divider-line"></div>
          <span>or</span>
          <div className="divider-line"></div>
        </div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            shape="pill"
            theme="filled_blue"
            size="large"
            text={isLogin ? "continue_with" : "signup_with"}
          />
        </div>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="toggle-link" onClick={toggleMode}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>

      <div className="floating-elements">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-element"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </GoogleOAuthProvider>
  );
}
  
 /*
  // Floating particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.floor(window.innerWidth / 10);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      // Draw connections between particles
      connectParticles();
      
      animationId = requestAnimationFrame(animate);
    };

    // Connect nearby particles
    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.strokeStyle = `rgba(180, 220, 255, ${1 - distance/100})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);
*/
  // Gradient background effect