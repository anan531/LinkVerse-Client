import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="home-navbar">

        <div className="home-logo">
          <div className="home-logo-box">L</div>
          <span>LinkVerse</span>
        </div>

        <div className="home-nav-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </button>

          <button onClick={() =>
            document.getElementById("features")?.scrollIntoView({
              behavior: "smooth"
            })
          }>
            Features
          </button>

          <button onClick={() => navigate("/login")}>
            Login
          </button>

          <button
            className="home-register-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>

      </nav>


      {/* Hero Section */}
      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-badge">
            STUDENT NETWORKING PLATFORM
          </span>

          <h1>
            Connect.
            <br />
            Collaborate.
            <br />
            <span>Grow Together.</span>
          </h1>

          <p>
            LinkVerse is a student networking platform that helps you
            connect with fellow students, discover opportunities,
            collaborate on projects and build meaningful academic
            connections.
          </p>

          <div className="home-hero-buttons">

            <button
              className="home-primary-button"
              onClick={() => navigate("/register")}
            >
              Get Started →
            </button>

            <button
              className="home-secondary-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

          </div>

        </div>


        {/* Hero Visual */}
        <div className="home-hero-visual">

          <div className="home-visual-card main-card">

            <div className="visual-icon">♢</div>

            <h3>Student Community</h3>

            <p>
              Connect with students who share your interests,
              skills and goals.
            </p>

            <div className="visual-tags">
              <span>Networking</span>
              <span>Skills</span>
              <span>Projects</span>
            </div>

          </div>

          <div className="floating-card floating-one">
            <strong>AI</strong>
            <span>Recommendations</span>
          </div>

          <div className="floating-card floating-two">
            <strong>+</strong>
            <span>Collaborate</span>
          </div>

        </div>

      </section>


      {/* Features */}
      <section className="home-features" id="features">

        <div className="home-section-heading">

          <span>WHAT LINKVERSE OFFERS</span>

          <h2>
            Everything you need to
            <br />
            connect and grow
          </h2>

          <p>
            A single platform designed to bring students,
            opportunities and collaboration together.
          </p>

        </div>


        <div className="home-feature-grid">

          <div className="home-feature-card">
            <div className="feature-number">01</div>
            <div className="feature-icon">◈</div>
            <h3>Student Networking</h3>
            <p>
              Discover students based on their skills,
              interests, courses and academic background.
            </p>
          </div>


          <div className="home-feature-card">
            <div className="feature-number">02</div>
            <div className="feature-icon">◇</div>
            <h3>Collaboration Hub</h3>
            <p>
              Find projects, create teams and collaborate
              with students who share your interests.
            </p>
          </div>


          <div className="home-feature-card">
            <div className="feature-number">03</div>
            <div className="feature-icon">↗</div>
            <h3>Opportunity Discovery</h3>
            <p>
              Explore internships, workshops, hackathons,
              scholarships and other student opportunities.
            </p>
          </div>


          <div className="home-feature-card">
            <div className="feature-number">04</div>
            <div className="feature-icon">✦</div>
            <h3>AI Recommendations</h3>
            <p>
              Receive personalized student recommendations
              based on your profile, skills and interests.
            </p>
          </div>


          <div className="home-feature-card">
            <div className="feature-number">05</div>
            <div className="feature-icon">◎</div>
            <h3>Student Feed</h3>
            <p>
              Share ideas, updates and useful information
              with your student community.
            </p>
          </div>


          <div className="home-feature-card">
            <div className="feature-number">06</div>
            <div className="feature-icon">◉</div>
            <h3>Direct Messaging</h3>
            <p>
              Communicate directly with your connections
              through the LinkVerse messaging system.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="home-cta">

        <div>
          <span>READY TO GET STARTED?</span>

          <h2>
            Your campus network
            <br />
            starts here.
          </h2>

          <p>
            Create your LinkVerse account and start
            connecting with your student community.
          </p>
        </div>

        <button
          onClick={() => navigate("/register")}
        >
          Create Your Account →
        </button>

      </section>


      {/* Footer */}
      <footer className="home-footer">

        <div className="home-footer-brand">
          <div className="home-logo">
            <div className="home-logo-box">L</div>
            <span>LinkVerse</span>
          </div>

          <p>
            Connecting students. Creating opportunities.
          </p>
        </div>

        <div className="home-footer-right">
          © 2026 LinkVerse. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Home;