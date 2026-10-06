import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    department: "",
    course: "",
    year: "",
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

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const college = formData.college.trim();
    const department = formData.department.trim();
    const course = formData.course.trim();
    const year = formData.year.trim();

    // NAME VALIDATION
    if (!name) {
      showNotification(
        "error",
        "Name required",
        "Please enter your full name."
      );
      return;
    }

    if (name.length < 2) {
      showNotification(
        "error",
        "Invalid name",
        "Name must contain at least 2 characters."
      );
      return;
    }

    // EMAIL VALIDATION
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

    // PASSWORD VALIDATION
    if (!password) {
      showNotification(
        "error",
        "Password required",
        "Please create a password."
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

    // CONFIRM PASSWORD
    if (!confirmPassword) {
      showNotification(
        "error",
        "Confirm password",
        "Please confirm your password."
      );
      return;
    }

    if (password !== confirmPassword) {
      showNotification(
        "error",
        "Passwords do not match",
        "Please make sure both passwords are the same."
      );
      return;
    }

    // COLLEGE
    if (!college) {
      showNotification(
        "error",
        "College required",
        "Please enter your college name."
      );
      return;
    }

    // DEPARTMENT
    if (!department) {
      showNotification(
        "error",
        "Department required",
        "Please enter your department."
      );
      return;
    }

    // COURSE
    if (!course) {
      showNotification(
        "error",
        "Course required",
        "Please enter your course."
      );
      return;
    }

    // YEAR
    if (!year) {
      showNotification(
        "error",
        "Year required",
        "Please enter your current year of study."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            college,
            department,
            course,
            year,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showNotification(
          "success",
          "Registration successful",
          "Your account has been created. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        showNotification(
          "error",
          "Registration failed",
          data.message || "Unable to create your account."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);

      showNotification(
        "error",
        "Connection error",
        "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="register-page">

      {/* NOTIFICATION */}
      {notification.show && (
        <div
          className={`register-notification ${
            notification.type === "success"
              ? "register-notification-success"
              : "register-notification-error"
          }`}
        >
          <div className="register-notification-icon">
            {notification.type === "success" ? "✓" : "!"}
          </div>

          <div className="register-notification-content">
            <strong>{notification.title}</strong>

            <p>{notification.message}</p>
          </div>

          <button
            type="button"
            className="register-notification-close"
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

      {/* LEFT PANEL */}
      <div className="register-left">

        <div className="register-brand">
          <div className="register-brand-mark">L</div>
          <span>LinkVerse</span>
        </div>

        <div className="register-welcome">

          <p className="register-small-text">
            JOIN LINKVERSE
          </p>

         <h1 className="register-hero-title">
    <span>Connect.</span><br></br>
    <br></br>
    <span>Collaborate.</span><br></br>
    <br></br>
    <span>Grow.</span>
    <br></br>
</h1>

          <p>
            Create your account and connect with students,
            discover opportunities, and collaborate on
            exciting projects.
          </p>

        </div>

        <div className="register-decoration register-decoration-one"></div>
        <div className="register-decoration register-decoration-two"></div>
        <div className="register-decoration register-decoration-three"></div>

      </div>

      {/* RIGHT PANEL */}
      <div className="register-right">

        <div className="register-box">

          <div className="register-header">

            <h2>Create Account</h2>

            <p>
              Join LinkVerse and start connecting
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="register-form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            {/* EMAIL */}
            <div className="register-form-group">

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

            {/* PASSWORD */}
            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="register-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

            </div>

            {/* COLLEGE */}
            <div className="register-form-group">

              <label htmlFor="college">
                College
              </label>

              <input
                id="college"
                type="text"
                name="college"
                placeholder="Enter your college"
                value={formData.college}
                onChange={handleChange}
              />

            </div>

            {/* DEPARTMENT */}
            <div className="register-form-group">

              <label htmlFor="department">
                Department
              </label>

              <input
                id="department"
                type="text"
                name="department"
                placeholder="Enter your department"
                value={formData.department}
                onChange={handleChange}
              />

            </div>

            {/* COURSE */}
            <div className="register-form-group">

              <label htmlFor="course">
                Course
              </label>

              <input
                id="course"
                type="text"
                name="course"
                placeholder="Enter your course"
                value={formData.course}
                onChange={handleChange}
              />

            </div>

<div className="register-form-group">
    <label htmlFor="year">Year</label>

<select
    id="year"
    name="year"
    value={formData.year}
    onChange={handleChange}
    className={formData.year === "" ? "year-placeholder" : ""}
>
    <option value="">Select your academic year</option>
    <option value="I">I</option>
    <option value="II">II</option>
    <option value="III">III</option>
    <option value="IV">IV</option>
</select>
</div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              className="register-submit"
            >
              Create Account
            </button>

          </form>

          {/* LOGIN LINK */}
          <div className="register-footer">

            <p>
              Already have an account?{" "}

              <button
                type="button"
                className="register-login-link"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;