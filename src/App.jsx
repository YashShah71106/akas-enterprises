import React, { useEffect, useRef } from 'react'; // Add useEffect here
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './index.css';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis'
gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const container = useRef(null);
  const marqueeRef = useRef(null); // Reference for the logo marquee

  const sentence = "Building Foundations With Reliable Manpower";
  const words = sentence.split(" ");

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Optional: smoother easing
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // IMPORTANT: Tell ScrollTrigger to watch Lenis
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- PRELOADER ANIMATION ---
    const preloaderTl = gsap.timeline();

    preloaderTl.to(".preloader-progress", {
      width: "100%",
      duration: 1.5,
      ease: "power2.inOut"
    })
      .to(".preloader", {
        yPercent: -100,      // CHANGE 1: Use yPercent instead of y: "-100%"
        duration: 1,
        ease: "power4.inOut"
      })
      .from(".navbar", {
        y: -20,
        opacity: 0,
        duration: 0.5
      }, "-=0.3");


    // --- 1. HERO TIMELINE (Entrance) ---
    const tl = gsap.timeline();

    gsap.set(".word-item", { y: 100 });
    gsap.set(".hero-subtext, .hero-btns", { opacity: 0, y: 20 });

    tl.from("nav", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
      .to(".word-item", {
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
      }, "-=0.5")
      .to(".hero-subtext, .hero-btns", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.5")
      .to(".mouse-wheel", {
        y: 12,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut"
      });

    // --- 2. LOGO MARQUEE ---
    if (marqueeRef.current) {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "none",
      });
    }

    // --- 3. ABOUT SECTION (Unified) ---
    if (document.querySelector(".about-section")) {
      gsap.from(".about-img-box", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 80%",
        },
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });

      gsap.from(".about-content", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 80%",
        },
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2
      });
    }

    // --- 4. STATISTICS COUNTER ---
    const counters = gsap.utils.toArray(".counter");
    counters.forEach((obj) => {
      const targetValue = parseInt(obj.getAttribute("data-target"));
      gsap.to(obj, {
        innerText: targetValue,
        duration: 2,
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: obj,
          start: "top 90%",
        },
      });
    });

    gsap.from(".stat-box", {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      scrollTrigger: {
        trigger: ".stats-section",
        start: "top 85%",
      }
    });

    // --- 5. SERVICES GRID (FIXED TRIGGER) ---
    if (document.querySelector(".service-card")) {
      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 100%", // Changed from 85% to 100% to trigger immediately
          toggleActions: "play none none none", // Ensures it plays once and stays
        },
        y: 50,           // Reduced from 80 for a faster feel
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });
    }

    // --- 6. WHY CHOOSE US ---
    const whyCards = gsap.utils.toArray(".why-card");
    if (whyCards.length > 0) {
      gsap.from(whyCards, {
        scrollTrigger: {
          trigger: ".why-grid",
          start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }

    // --- 7. PROCESS TIMELINE ---
    gsap.to(".timeline-filler", {
      scrollTrigger: {
        trigger: ".timeline-wrapper",
        start: "top 60%",
        end: "bottom 60%",
        scrub: 1,
      },
      height: "100%",
      ease: "none"
    });

    const processItems = gsap.utils.toArray(".process-item");
    processItems.forEach((item) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 60%",
          onEnter: () => item.classList.add("active"),
          onLeaveBack: () => item.classList.remove("active"),
        },
      });

      gsap.from(item.querySelector(".process-info"), {
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 1
      });
    });

    // --- 8. TESTIMONIALS ---
    if (document.querySelector(".testi-container")) {
      gsap.from(".testi-container", {
        scrollTrigger: {
          trigger: ".testi-section",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1.2
      });

      // Slider Logic
      const testiCards = document.querySelectorAll(".testi-card");
      const dots = document.querySelectorAll(".nav-dot");
      let currentIndex = 0;

      const switchTesti = () => {
        if (testiCards.length === 0) return;
        testiCards[currentIndex].classList.remove("active");
        dots[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % testiCards.length;
        testiCards[currentIndex].classList.add("active");
        dots[currentIndex].classList.add("active");

        gsap.fromTo(testiCards[currentIndex].querySelector(".testi-text"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 }
        );
      };

      const testiInterval = setInterval(switchTesti, 5000);
      return () => clearInterval(testiInterval); // Cleanup on unmount
    }

    // --- 9. CONTACT SECTION ---
    if (document.querySelector(".contact-info")) {
      gsap.from(".contact-info", {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 80%",
        },
        x: -100,
        opacity: 0,
        duration: 1.2
      });
    }

    if (document.querySelector(".contact-form-box")) {
      gsap.from(".contact-form-box", {
        scrollTrigger: {
          trigger: ".contact-section",
          start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        delay: 0.2
      });
    }

    // --- 10. FOOTER ---
    if (document.querySelector(".footer-col")) {
      gsap.from(".footer-col", {
        scrollTrigger: {
          trigger: ".footer",
          start: "top 90%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2
      }, { scope: container });
    }



    gsap.registerPlugin(ScrollTrigger);

    // --- 1. SERVICES ENTRANCE ANIMATION ---
    const cards = gsap.utils.toArray(".service-card");

    if (cards.length > 0) {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 95%", // Trigger as soon as the grid enters the screen
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        // This ensures they are fully visible after animation
        onComplete: () => gsap.set(cards, { clearProps: "opacity,y" })
      });
    }

    // --- 2. THE SPOTLIGHT EFFECT (Optimized) ---
    const handleMouseMove = (e) => {
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);

  }, { scope: container });

  window.addEventListener("mousemove", (e) => {
    gsap.to(".custom-cursor", {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: "power2.out"
    });
  });

  // Make it grow on hover
  const hoverElements = document.querySelectorAll("button, a, .service-card");
  hoverElements.forEach(el => {
    el.onmouseenter = () => gsap.to(".custom-cursor", { scale: 4, opacity: 0.5 });
    el.onmouseleave = () => gsap.to(".custom-cursor", { scale: 1, opacity: 1 });
  });










  // last

  return (
    // THE FIX: This div MUST wrap EVERYTHING
    <div ref={container} className="layout-wrapper">

      {/* 1. Preloader (Must be inside) */}
      <div className="preloader">
        <div className="preloader-content">
          <div className="preloader-text">AKAS</div>
          <div className="preloader-bar">
            <div className="preloader-progress"></div>
          </div>
        </div>
      </div>

      {/* 2. Custom Cursor (Must be inside) */}
      <div className="custom-cursor"></div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <h1>AKAS <span>ENTERPRISES</span></h1>
        </div>
        <div className="nav-right">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        {/* Background Video */}
        <div className="video-container">
          <video src="https://www.pexels.com/download/video/34199760/"></video>
          <div className="overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            {words.map((word, i) => (
              <span key={i} className="word-wrapper">
                <span className="word-item">{word}</span>
              </span>
            ))}
          </h1>

          <p className="hero-subtext">
            Mehsana's leading provider for industrial labor, management staffing, and specialized contracts.
          </p>

          <div className="hero-btns">
            <button className="btn-red">Hire Manpower</button>
            <button className="btn-white">Our Services</button>
          </div>
        </div>

        {/* Scroll Down Mouse */}
        <div className="scroll-down">
          <div className="mouse">
            <div className="mouse-wheel"></div>
          </div>
        </div>
      </section>

      {/* About Section */}

      {/* ABOUT SECTION */}
      {/* --- 4. ABOUT SECTION --- */}
      <section className="about-section" id="about">
        <div className="about-container">

          {/* Left Side: Image with Red Badge */}
          <div className="about-img-box">
            <div className="about-image-wrapper">
              <img
                src="https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg"
                alt="Construction Site"
              />
            </div>
            {/* Floating Red Badge */}
            <div className="about-badge">
              <h3 className="badge-number">15+</h3>
              <p className="badge-text">Years of Excellence</p>
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="about-content">
            <div className="about-tag">
              <div className="tag-line"></div>
              <span>Who We Are</span>
            </div>
            <h2 className="about-title">Providing the Backbone for Your <span>Industrial Success</span></h2>
            <p className="about-description">
              AKAS ENTERPRISES is a premier manpower contracting firm based in Mehsana, specializing in providing highly skilled and reliable workforce solutions. We bridge the gap between industrial needs and human potential.
            </p>
            <ul className="about-list">
              <li><span className="check">✓</span> Verified & Skilled Workforce</li>
              <li><span className="check">✓</span> 24/7 Management Support</li>
              <li><span className="check">✓</span> Strict Compliance with Labor Laws</li>
            </ul>
            <button className="about-btn">Learn More About Us</button>
          </div>

        </div>
      </section>
      {/* marque section */}
      {/* --- CLIENTS LOGO MARQUEE --- */}
      <section className="marquee-container">
        <div className="marquee-header">
          <p>TRUSTED BY OVER 50+ COMPANIES</p>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-track" ref={marqueeRef}>
            {/* Set 1 */}
            <div className="logo-item">RELIANCE</div>
            <div className="logo-item">TATA STEEL</div>
            <div className="logo-item">ADANI</div>
            <div className="logo-item">L&T</div>
            <div className="logo-item">JINDAL</div>
            <div className="logo-item">ONGC</div>

            {/* Set 2 (Duplicate for seamless loop) */}
            <div className="logo-item">RELIANCE</div>
            <div className="logo-item">TATA STEEL</div>
            <div className="logo-item">ADANI</div>
            <div className="logo-item">L&T</div>
            <div className="logo-item">JINDAL</div>
            <div className="logo-item">ONGC</div>
          </div>
        </div>
      </section>

      {/* --- STATISTICS SECTION --- */}


      <section className="stats-section">
        <div className="stats-container">

          {/* Stat 1 */}
          <div className="stat-box">
            <h2 className="stat-number">
              <span className="counter" data-target="5000">0</span>+
            </h2>
            <p className="stat-label">Workers Supplied</p>
          </div>

          {/* Stat 2 */}
          <div className="stat-box">
            <h2 className="stat-number highlight">
              <span className="counter" data-target="150">0</span>+
            </h2>
            <p className="stat-label">Active Clients</p>
          </div>

          {/* Stat 3 */}
          <div className="stat-box">
            <h2 className="stat-number">
              <span className="counter" data-target="25">0</span>+
            </h2>
            <p className="stat-label">Cities Covered</p>
          </div>

          {/* Stat 4 */}
          <div className="stat-box">
            <h2 className="stat-number">
              <span className="counter" data-target="100">0</span>%
            </h2>
            <p className="stat-label">Safety Record</p>
          </div>

        </div>
      </section>
      {/* Services section */}


      {/* --- 6. SERVICES SECTION --- */}
      <section className="services-section" id="services">
        <div className="services-container">

          <div className="services-header">
            <h4 className="services-subtitle">WHAT WE OFFER</h4>
            <h2 className="services-title">Specialized Manpower <span>Solutions</span></h2>
          </div>

          <div className="services-grid">
            {/* Service 1 */}
            <div className="service-card">

              <h3 className="service-card-title">Industrial Labor</h3>
              <p className="service-card-text">Skilled and semi-skilled labor solutions for high-performance manufacturing units.</p>
              <div className="service-btn">
                <div className="btn-line"></div>
                <span>Explore</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="service-card">

              <h3 className="service-card-title">Management Staffing</h3>
              <p className="service-card-text">Expert supervisors and project managers to streamline your industrial operations.</p>
              <div className="service-btn">
                <div className="btn-line"></div>
                <span>Explore</span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="service-card">

              <h3 className="service-card-title">Technical Support</h3>
              <p className="service-card-text">Certified technicians, electricians, and welders for specialized technical tasks.</p>
              <div className="service-btn">
                <div className="btn-line"></div>
                <span>Explore</span>
              </div>
            </div>

            {/* Service 4 */}
            <div className="service-card">

              <h3 className="service-card-title">HR & Compliance</h3>
              <p className="service-card-text">Complete management of labor laws, payroll, and industrial regulatory compliance.</p>
              <div className="service-btn">
                <div className="btn-line"></div>
                <span>Explore</span>
              </div>
            </div>

            {/* Service 5 */}
            <div className="service-card">

              <h3 className="service-card-title">Warehouse Ops</h3>
              <p className="service-card-text">Reliable loaders and inventory managers for seamless logistics and supply chains.</p>
              <div className="service-btn">
                <div className="btn-line"></div>
                <span>Explore</span>
              </div>
            </div>

            {/* Service 6 */}
            <div className="service-card">

              <h3 className="service-card-title">Site Maintenance</h3>
              <p className="service-card-text">Full-scale plant maintenance for corporate and industrial spaces.</p>
              <div className="service-btn">
                <div className="btn-line"></div>
                <span>Explore</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Industrieas Section */}
      {/* --- 7. INDUSTRIES BENTO GRID --- */}
      <section className="industries-section" id="industries">
        <div className="industries-container">

          {/* Section Header */}
          <div className="industries-header">
            <h4 className="ind-subtitle">Industries We Serve</h4>
            <h2 className="ind-title">Powering India's <br /> Core <span>Sectors</span></h2>
          </div>

          <div className="bento-grid">

            {/* 1. Construction - USING GUARANTEED LINK */}
            <div className="bento-card bento-large">
              <img
                src="https://plus.unsplash.com/premium_photo-1681691912442-68c4179c530c?q=80&w=2000"
                alt="Construction"
              />
              <div className="bento-overlay">
                <div className="bento-tag">Primary Sector</div>
                <h3>Construction & <br /> Infrastructure</h3>
                <p>End-to-end manpower for civil engineering projects.</p>
              </div>
            </div>

            {/* 2. Manufacturing (Already working) */}
            <div className="bento-card bento-small">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070"
                alt="Manufacturing"
              />
              <div className="bento-overlay">
                <h3>Manufacturing</h3>
              </div>
            </div>

            {/* 3. Oil & Gas - USING GUARANTEED LINK */}
            <div className="bento-card bento-small">
              <img
                src="https://plus.unsplash.com/premium_photo-1682148795124-dac95dd91fd4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2lsJTIwYW5kJTIwZ2FzJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D"
                alt="Oil"
              />
              <div className="bento-overlay">
                <h3>Oil & Gas</h3>
              </div>
            </div>

            {/* 4. Warehouse (Already working) */}
            <div className="bento-card bento-wide">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070"
                alt="Logistics"
              />
              <div className="bento-overlay">
                <div className="bento-tag">Logistics</div>
                <h3>Warehouse & Supply Chain</h3>
                <p>Expert labor management for fulfillment centers.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* why choose us */}

      {/* --- 8. WHY CHOOSE US SECTION --- */}
      <section className="why-section" id="why-choose-us">
        <div className="why-container">
          <div className="why-header">
            <h4 className="why-subtitle">The Akas Advantage</h4>
            <h2 className="why-title">Why Industry Leaders <br /> <span>Choose Us</span></h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">01</div>
              <h3>Rigorous Vetting</h3>
              <p>Every worker undergoes a strict background check and skill verification.</p>
            </div>
            <div className="why-card why-highlight">
              <div className="why-icon">02</div>
              <h3>Rapid Deployment</h3>
              <p>We deploy 100+ skilled workers to your site within 48 hours.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">03</div>
              <h3>Zero Compliance Risk</h3>
              <p>We handle 100% of PF, ESIC, and labor law documentation.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">04</div>
              <h3>24/7 Field Support</h3>
              <p>On-site supervisors available 24/7 to manage labor and resolve issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 9. PROCESS TIMELINE SECTION --- */}
      <section className="process-section">
        <div className="process-container">

          <div className="process-header">
            <h4 className="process-subtitle">Our Workflow</h4>
            <h2 className="process-title">How We <span>Operate</span></h2>
          </div>

          <div className="timeline-wrapper">
            {/* The moving progress line */}
            <div className="timeline-line">
              <div className="timeline-filler"></div>
            </div>

            <div className="process-steps">
              {/* Step 1 */}
              <div className="process-item">
                <div className="process-dot">1</div>
                <div className="process-info">
                  <h3>Consultation</h3>
                  <p>We analyze your project requirements, site conditions, and specific skill needs.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="process-item">
                <div className="process-dot">2</div>
                <div className="process-info">
                  <h3>Sourcing & Vetting</h3>
                  <p>Our team identifies the best candidates from our database and conducts rigorous skill tests.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="process-item">
                <div className="process-dot">3</div>
                <div className="process-info">
                  <h3>Compliance Check</h3>
                  <p>We ensure all legal documentations, PF, ESIC, and safety certifications are in order.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="process-item">
                <div className="process-dot">4</div>
                <div className="process-info">
                  <h3>Deployment</h3>
                  <p>The workforce is mobilized to your site with a dedicated on-site supervisor.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- 10. TESTIMONIALS SECTION --- */}
      <section className="testi-section">
        <div className="testi-container">

          <div className="testi-header">
            <h4 className="testi-subtitle">Client Stories</h4>
            <h2 className="testi-title">What Industrial <br /> <span>Leaders Say</span></h2>
          </div>

          <div className="testi-wrapper">
            {/* Testimonial Card 1 */}
            <div className="testi-card active">
              <div className="quote-icon">“</div>
              <p className="testi-text">
                "AKAS ENTERPRISES has been our go-to partner for skilled labor for over 5 years. Their response time and commitment to safety compliance are unmatched in the Mehsana region."
              </p>
              <div className="testi-author">
                <div className="author-info">
                  <span className="author-name">Rajesh Mehta</span>
                  <span className="author-pos">Project Manager, Tata Steel</span>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="testi-card">
              <div className="quote-icon">“</div>
              <p className="testi-text">
                "The management staffing provided by AKAS allowed us to scale our production line by 40% within just two months. Highly professional and reliable team."
              </p>
              <div className="testi-author">
                <div className="author-info">
                  <span className="author-name">Sanjay Shah</span>
                  <span className="author-pos">Operations Head, Reliance Industries</span>
                </div>
              </div>
            </div>

            {/* Slider Nav dots */}
            <div className="testi-nav">
              <div className="nav-dot active"></div>
              <div className="nav-dot"></div>
            </div>
          </div>

        </div>
      </section>

      {/* --- 11. CONTACT SECTION --- */}
      <section className="contact-section" id="contact">
        <div className="contact-container">

          {/* Left Side: Contact Info */}
          <div className="contact-info">
            <h4 className="contact-subtitle">Get In Touch</h4>
            <h2 className="contact-title">Ready to <span>Scale?</span></h2>
            <p className="contact-desc">
              Connect with Mehsana's most reliable manpower partner. We are here to help you solve your workforce challenges.
            </p>

            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div className="info-text">
                  <h5>Our Office</h5>
                  <p style={{ fontWeight: 'bold', color: 'crimson' }}> F-6 , Parekh Point , Above Madhvi Dairy
                    Radhanpur Road , Mehsana </p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div className="info-text">
                  <h5>Call Us</h5>
                  <p style={{ fontWeight: 'bold', color: 'crimson' }}>+91  73 83 69 5555</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div className="info-text">
                  <h5>Email Us</h5>
                  <p style={{ fontWeight: 'bold', color: 'crimson' }}>SiyaEnterprise1124@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-box">
            <form className="main-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="email@company.com" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select>
                  <option>Hire Manpower</option>
                  <option>Project Inquiry</option>
                  <option>Job Application</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" className="form-btn">
                Send Inquiry <span>→</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* --- 12. MAP SECTION --- */}
      <section className="map-section">
        <div className="map-wrapper">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.9432928709125!2d72.37936847573243!3d23.606366594289927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c43abfd7a79ad%3A0x5970fda3ec1164ab!2sSiya%20Enterprise%3A%20Loan%20on%20Used%20Cars!5e0!3m2!1sen!2sin!4v1781856604662!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </section>

      {/* --- 13. FOOTER SECTION --- */}
      {/* --- 13. FOOTER SECTION --- */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-grid">
            {/* Column 1: Brand & About */}
            <div className="footer-col">
              <div className="footer-logo">AKAS <span>ENTERPRISES</span></div>
              <p className="footer-about">
                Mehsana's leading provider for industrial labor, management staffing, and specialized contracts. Building foundations with reliable manpower since 2009.
              </p>
              <div className="footer-socials">
                <a href="#">FB</a> <a href="#">TW</a> <a href="#">LN</a> <a href="#">IG</a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#industries">Industries</a></li>
              </ul>
            </div>

            {/* Column 3: Our Services */}
            <div className="footer-col">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li>Industrial Labor</li>
                <li>Staffing Solutions</li>
                <li>Technical Support</li>
                <li>HR & Payroll</li>
              </ul>
            </div>

            {/* Column 4: CONTACT INFORMATION */}
            <div className="footer-col">
              <h4 className="footer-heading">Contact Us</h4>
              <div className="footer-contact-details">
                <div className="contact-item">
                  <span className="c-icon">📍</span>
                  <p style={{ fontWeight: 'bold', color: 'crimson' }}> F-6 , Parekh Point , Above Madhvi Dairy
                    Radhanpur Road , Mehsana </p>
                </div>
                <div className="contact-item">
                  <span className="c-icon">📞</span>
                  <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                </div>
                <div className="contact-item">
                  <span className="c-icon">✉️</span>
                  <p style={{ fontWeight: 'bold', color: 'crimson' }}><a href="mailto:info@akasenterprises.com">SiyaEnterprise1124@gmail.com</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-line"></div>
            <div className="footer-copyright">
              <p>&copy; 2024 AKAS ENTERPRISES. ALL RIGHTS RESERVED.</p>
              <p>RELIABILITY AT SCALE</p>
            </div>
          </div>

        </div>
      </footer>

    </div>




  );
}

export default App;