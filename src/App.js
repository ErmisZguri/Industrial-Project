import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Projects from './pages/Projects'; // Import the Projects page component
import './App.css';

function App() {
  const blueSectionRef = useRef(null);
  const counterSectionRef = useRef(null);
  const partnersSectionRef = useRef(null);

  const [isBlueSectionVisible, setIsBlueSectionVisible] = useState(false);
  const [isCounterSectionVisible, setIsCounterSectionVisible] = useState(false);
  const [isPartnersSectionVisible, setIsPartnersSectionVisible] = useState(false);

  // Intersection Observer for pop-in effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'blue-section') {
            setIsBlueSectionVisible(true);
          }
          if (entry.target.id === 'counter-section') {
            setIsCounterSectionVisible(true);
          }
          if (entry.target.id === 'partners-section') {
            setIsPartnersSectionVisible(true);
          }
        }
      },
      { root: null, threshold: 0.5 }
    );

    if (blueSectionRef.current) observer.observe(blueSectionRef.current);
    if (counterSectionRef.current) observer.observe(counterSectionRef.current);
    if (partnersSectionRef.current) observer.observe(partnersSectionRef.current);

    return () => {
      if (blueSectionRef.current) observer.unobserve(blueSectionRef.current);
      if (counterSectionRef.current) observer.unobserve(counterSectionRef.current);
      if (partnersSectionRef.current) observer.unobserve(partnersSectionRef.current);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/projects">Explore Projects</Link>
          </div>
          <div className="navbar-center">
            <img src="/logo.png" alt="University Logo" className="logo" />
          </div>
          <div className="navbar-right">
            <a href="#about">About Us</a>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {/* Landing Section */}
                <header className="hero-section">
                  <h1>University of York</h1>
                  <h2>Industrial Projects</h2>
                  <p className="tagline">Bridging Academia and Industry for a Better Tomorrow</p>
                  <button className="hero-button">Discover More</button>
                </header>

                {/* Blue Section */}
                <section
                  id="blue-section"
                  ref={blueSectionRef}
                  className={`blue-section ${isBlueSectionVisible ? 'visible' : ''}`}
                >
                  <div className="content">
                    <div className="card">
                      <h3>What is the Industrial Project?</h3>
                      <p>Students collaborate with industry partners to solve real-world problems.</p>
                    </div>
                    <div className="card">
                      <h3>Hands-On Learning</h3>
                      <p>Our program equips students with the skills needed to succeed in the workforce.</p>
                    </div>
                    <div className="card">
                      <h3>Innovative Solutions</h3>
                      <p>Projects drive innovation and create lasting impacts for partners.</p>
                    </div>
                    <div className="card">
                      <h3>Global Recognition</h3>
                      <p>Showcase your work to a worldwide audience and build your career.</p>
                    </div>
                  </div>
                </section>

                {/* Dynamic Counter Section */}
                <section
                  id="counter-section"
                  ref={counterSectionRef}
                  className={`counter-section ${isCounterSectionVisible ? 'visible' : ''}`}
                >
                  <h3>Our Achievements</h3>
                  <div className="counters">
                    <div className="counter">
                      <h4>500+</h4>
                      <p>Projects Completed</p>
                    </div>
                    <div className="counter">
                      <h4>100+</h4>
                      <p>Industry Partners</p>
                    </div>
                    <div className="counter">
                      <h4>95%</h4>
                      <p>Employment Rate</p>
                    </div>
                  </div>
                </section>

                {/* Modern Partners Section */}
                <section
                  id="partners-section"
                  ref={partnersSectionRef}
                  className={`partners-section ${isPartnersSectionVisible ? 'visible' : ''}`}
                >
                  <h3>Our Trusted Partners</h3>
                  <div className="partners-grid">
                    <div className="partner-logo"><span>Google</span></div>
                    <div className="partner-logo"><span>Tesla</span></div>
                    <div className="partner-logo"><span>Microsoft</span></div>
                    <div className="partner-logo"><span>Amazon</span></div>
                    <div className="partner-logo"><span>IBM</span></div>
                    <div className="partner-logo"><span>Intel</span></div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                  <div>Meet the team</div>
                  <button className="explore-button">Explore Projects</button>
                  <div className="social-icons">
                    <i className="fa fa-instagram"></i>
                    <i className="fa fa-facebook"></i>
                    <i className="fa fa-linkedin"></i>
                  </div>
                </footer>
              </div>
            }
          />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
