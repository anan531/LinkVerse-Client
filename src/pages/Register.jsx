import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    course: "",
    year: "",
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
        "http://localhost:5000/api/auth/register",
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
        alert("Registration successful!");
        console.log(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="register-page">

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

          <h1>
            Connect.
            <br />
            Collaborate.
            <br />
            <span>Grow.</span>
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
                required
              />

            </div>


            {/* EMAIL */}
            <div className="register-form-group">

              <label htmlFor="email">
                Email Address
              </label>

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
                required
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
                required
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
                required
              />

            </div>


            {/* YEAR */}
            <div className="register-form-group">

              <label htmlFor="year">
                Year
              </label>

              <input
                id="year"
                type="text"
                name="year"
                placeholder="Enter your graduation year"
                value={formData.year}
                onChange={handleChange}
                required
              />

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