
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        title: "",
        message: "",
      });
    }, 3500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    // Email validation
    if (!email) {
      showNotification(
        "error",
        "Email required",
        "Please enter your email address."
      );
      return;
    }

    if (!email.includes("@")) {
      showNotification(
        "error",
        "Invalid email",
        "Your email is missing the @ symbol."
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showNotification(
        "error",
        "Invalid email",
        "Please enter a valid email address."
      );
      return;
    }

    // Password validation
    if (password.trim() === "") {
      showNotification(
        "error",
        "Password required",
        "Please enter your password."
      );
      return;
    }

    if (password.length < 6) {
      showNotification(
        "error",
        "Invalid password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        showNotification(
          "success",
          "Login successful",
          "Welcome back to LinkVerse."
        );

        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1200);
      } else {
        if (data.message === "Invalid email or password") {
          showNotification(
            "error",
            "Login failed",
            "Invalid email or password."
          );
        } else {
          showNotification(
            "error",
            "Login failed",
            data.message || "Unable to login."
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      showNotification(
        "error",
        "Connection error",
        "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="login-page">
      {/* Notification */}
      {notification.show && (
        <div
          className={`login-notification ${
            notification.type === "success"
              ? "notification-success"
              : "notification-error"
          }`}
        >
          <div className="notification-icon">
            {notification.type === "success" ? "✓" : "!"}
          </div>

          <div className="notification-content">
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>

          <button
            type="button"
            className="notification-close"
            onClick={() =>
              setNotification({
                show: false,
                type: "",
                title: "",
                message: "",
              })
            }
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        className="back-home-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* Left Side */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-mark">L</div>
          <span>LinkVerse</span>
        </div>

        <div className="login-welcome">
          <p className="login-small-text">
            WELCOME BACK
          </p>

          <h1 className="hero-title">
            <span>Connect.</span>
            <span>Collaborate.</span>
            <span>Grow.</span>
          </h1>

          <p>
            Connect with students, discover opportunities,
            collaborate on projects, and build your network.
          </p>
        </div>

        <div className="login-decoration decoration-one"></div>
        <div className="login-decoration decoration-two"></div>
        <div className="login-decoration decoration-three"></div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Login to continue to LinkVerse</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  title={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    /* Eye with a slash: password is visible */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 9 5 10 7-0.5 1-1.4 2.3-2.8 3.5" />
                      <path d="M6.2 6.2C3.8 7.7 2.5 10 2 12c1 2 5 7 10 7 1 0 2-.2 2.9-.6" />
                    </svg>
                  ) : (
                    /* Normal eye: password is hidden */
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="login-submit"
            >
              Login
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="login-register-link"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;