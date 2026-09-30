
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
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
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successfully!");

        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Reset password error:", error);

      alert("Unable to connect to server");
    }
  };

  return (
    <div className="forgot-password-page">

      <div className="forgot-password-box">

        <div className="forgot-password-header">
          <div className="forgot-password-logo">L</div>

          <h2>Reset Password</h2>

          <p>
            Enter your registered email and create a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="forgot-password-form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-password-form-group">
            <label htmlFor="newPassword">
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="forgot-password-submit"
          >
            Reset Password
          </button>

        </form>

        <button
          type="button"
          className="forgot-password-back"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>

      </div>

    </div>
  );
}

export default ForgotPassword;

