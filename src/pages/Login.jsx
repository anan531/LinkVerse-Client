import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
        if (
          data.message === "Invalid email or password"
        ) {
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

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="forgot-password-link"
                onClick={() =>
                  navigate("/forgot-password")
                }
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
                onClick={() =>
                  navigate("/register")
                }
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