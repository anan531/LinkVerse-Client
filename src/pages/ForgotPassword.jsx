import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
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


  // =========================================
  // STEP 1 - SEND OTP
  // =========================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();

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

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormData({
          ...formData,
          email,
        });

        setStep(2);

        showNotification(
          "success",
          "OTP sent",
          "A verification code has been sent to your email."
        );
      } else {
        showNotification(
          "error",
          "Unable to send OTP",
          data.message || "Please try again."
        );
      }
    } catch (error) {
      console.error("Send OTP error:", error);

      showNotification(
        "error",
        "Connection error",
        "Unable to connect to the server."
      );
    }
  };


  // =========================================
  // STEP 2 - VERIFY OTP
  // =========================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!formData.otp.trim()) {
      showNotification(
        "error",
        "OTP required",
        "Please enter the OTP sent to your email."
      );
      return;
    }

    if (!/^\d{6}$/.test(formData.otp.trim())) {
      showNotification(
        "error",
        "Invalid OTP",
        "Please enter the 6-digit OTP."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStep(3);

        showNotification(
          "success",
          "OTP verified",
          "You can now create your new password."
        );
      } else {
        showNotification(
          "error",
          "Verification failed",
          data.message || "Invalid OTP."
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      showNotification(
        "error",
        "Connection error",
        "Unable to connect to the server."
      );
    }
  };


  // =========================================
  // STEP 3 - RESET PASSWORD
  // =========================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.newPassword) {
      showNotification(
        "error",
        "Password required",
        "Please enter a new password."
      );
      return;
    }

    if (formData.newPassword.length < 6) {
      showNotification(
        "error",
        "Invalid password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (!formData.confirmPassword) {
      showNotification(
        "error",
        "Confirm password",
        "Please confirm your new password."
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showNotification(
        "error",
        "Passwords do not match",
        "Please make sure both passwords are the same."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showNotification(
          "success",
          "Password reset successfully",
          "Your password has been changed. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showNotification(
          "error",
          "Reset failed",
          data.message || "Unable to reset password."
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);

      showNotification(
        "error",
        "Connection error",
        "Unable to connect to the server."
      );
    }
  };


  return (
    <div className="forgot-password-page">

      {/* Notification */}

      {notification.show && (
        <div
          className={`forgot-notification ${
            notification.type === "success"
              ? "forgot-notification-success"
              : "forgot-notification-error"
          }`}
        >
          <div className="forgot-notification-icon">
            {notification.type === "success" ? "✓" : "!"}
          </div>

          <div className="forgot-notification-content">
            <strong>{notification.title}</strong>

            <p>{notification.message}</p>
          </div>

          <button
            type="button"
            className="forgot-notification-close"
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


      <div className="forgot-password-box">

        <div className="forgot-password-header">

          <div className="forgot-password-logo">
            L
          </div>

          <p className="forgot-password-step">
            STEP {step} OF 3
          </p>

          <h2>
            {step === 1 && "Reset Password"}

            {step === 2 && "Verify OTP"}

            {step === 3 && "Create New Password"}
          </h2>

          <p>
            {step === 1 &&
              "Enter your registered email to receive a verification code."}

            {step === 2 &&
              "Enter the 6-digit OTP sent to your email address."}

            {step === 3 &&
              "Create a new password for your LinkVerse account."}
          </p>

        </div>


        {/* =====================================
            STEP 1
        ===================================== */}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>

            <div className="forgot-password-form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="text"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            <button
              type="submit"
              className="forgot-password-submit"
            >
              Send OTP
            </button>

          </form>
        )}


        {/* =====================================
            STEP 2
        ===================================== */}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>

            <div className="forgot-password-form-group">

              <label htmlFor="otp">
                Verification Code
              </label>

              <input
                id="otp"
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                inputMode="numeric"
              />

              <p className="forgot-password-helper">
                OTP expires in 5 minutes.
              </p>

            </div>

            <button
              type="submit"
              className="forgot-password-submit"
            >
              Verify OTP
            </button>

            <button
              type="button"
              className="forgot-password-secondary"
              onClick={() => setStep(1)}
            >
              ← Change Email
            </button>

          </form>
        )}


        {/* =====================================
            STEP 3
        ===================================== */}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>

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
              />

            </div>

            <div className="forgot-password-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

            </div>

            <button
              type="submit"
              className="forgot-password-submit"
            >
              Reset Password
            </button>

          </form>
        )}


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