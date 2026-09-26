import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save user information
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");

        // Redirect based on user role
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-left">

        <div className="login-brand">
          <div className="login-brand-mark">L</div>
          <span>LinkVerse</span>
        </div>

        <div className="login-welcome">
          <p className="login-small-text">WELCOME BACK</p>

          <h1>
            Connect.
            <br />
            Collaborate.
            <br />
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
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
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