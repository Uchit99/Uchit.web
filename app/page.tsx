"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  Menu,
   MessageCircle,
  PenTool,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  live_url: string;
  image_url: string | null;
};

const services = [
  {
    number: "01",
    title: "WEB DESIGN",
    description:
      "Premium visual design built around your brand, customers and business goals.",
    icon: PenTool,
  },
  {
    number: "02",
    title: "DEVELOPMENT",
    description:
      "Fast, responsive websites built with modern technology and clean structure.",
    icon: Code2,
  },
  {
    number: "03",
    title: "UI / UX",
    description:
      "Simple interfaces and intuitive experiences that make websites easy to use.",
    icon: Smartphone,
  },
  {
    number: "04",
    title: "MOTION",
    description:
      "Purposeful animation and interactions that make the experience feel alive.",
    icon: Sparkles,
  },
];

const process = [
  {
    number: "01",
    title: "DISCOVER",
    text: "We understand your business, audience and goals.",
  },
  {
    number: "02",
    title: "DESIGN",
    text: "I create the visual direction and user experience.",
  },
  {
    number: "03",
    title: "BUILD",
    text: "The approved design becomes a fast working website.",
  },
  {
    number: "04",
    title: "LAUNCH",
    text: "Your website goes live and starts working for your business.",
  },
];
const pricing = [
  {
    number: "01",
    name: "LANDING PAGE",
    price: "₹2,999+",
    description:
      "A focused one-page website designed to promote a product, service, campaign or offer.",
    bestFor: "Ads • Campaigns • Lead Generation",
    features: [
      "1 High-converting page",
      "Responsive design",
      "Call-to-action sections",
      "WhatsApp integration",
      "Contact / lead form",
      "Basic SEO",
    ],
  },
  {
    number: "02",
    name: "BUSINESS WEBSITE",
    price: "₹4,999+",
    description:
      "A professional multi-page website that builds trust and gives your business a strong online presence.",
    bestFor: "Local Businesses • Services • Agencies",
    featured: true,
    features: [
      "Up to 5 pages",
      "Premium UI / UX",
      "Responsive design",
      "WhatsApp integration",
      "Contact form",
      "Google Maps",
      "Basic SEO setup",
    ],
  },
  {
    number: "03",
    name: "PORTFOLIO WEBSITE",
    price: "₹4,999+",
    description:
      "A modern personal website designed to showcase your work, skills, projects and professional identity.",
    bestFor: "Developers • Designers • Creators",
    features: [
      "Up to 5 pages",
      "Project showcase",
      "Premium animations",
      "Responsive design",
      "Contact section",
      "Social media integration",
      "SEO setup",
    ],
  },
  {
    number: "04",
    name: "E-COMMERCE",
    price: "₹12,999+",
    description:
      "A complete online store designed to showcase products and help your business sell online.",
    bestFor: "Retailers • Brands • Online Stores",
    features: [
      "Product catalogue",
      "Shopping cart",
      "Product categories",
      "Checkout integration",
      "Payment gateway",
      "Order management",
      "Responsive design",
    ],
  },
  {
    number: "05",
    name: "BOOKING WEBSITE",
    price: "₹9,999+",
    description:
      "A professional website with booking functionality to help customers schedule appointments or services.",
    bestFor: "Gyms • Salons • Consultants • Services",
    features: [
      "Service pages",
      "Booking system",
      "Contact / enquiry forms",
      "WhatsApp integration",
      "Responsive design",
      "Google Maps",
      "SEO setup",
    ],
  },
  {
    number: "06",
    name: "CUSTOM WEBSITE",
    price: "₹14,999+",
    description:
      "A fully custom website built around your exact business requirements and functionality.",
    bestFor: "Startups • Brands • Advanced Projects",
    features: [
      "Custom UI / UX",
      "Advanced animations",
      "Custom functionality",
      "Database integration",
      "Admin dashboard",
      "Third-party integrations",
      "Performance optimization",
    ],
  },
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("work");

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, description, category, live_url, image_url"
        )
        .eq("published", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(6);

      if (error) {
        console.error("Error loading projects:", error);
        return;
      }

      if (data) {
        setProjects(data);
      }
    }

    loadProjects();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);

      const sections = [
        "work",
        "services",
        "about",
        "pricing",
        "contact",
      ];

      let currentSection = "work";

      for (const id of sections) {
        const element = document.getElementById(id);

        if (!element) continue;

        const position = element.getBoundingClientRect();

        if (position.top <= 180) {
          currentSection = id;
        }
      }

      setActiveSection(currentSection);
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    {
      label: "WORK",
      href: "#work",
      id: "work",
    },
    {
      label: "SERVICES",
      href: "#services",
      id: "services",
    },
    {
      label: "ABOUT",
      href: "#about",
      id: "about",
    },
    {
      label: "PRICING",
      href: "#pricing",
      id: "pricing",
    },
    {
      label: "CONTACT",
      href: "#contact",
      id: "contact",
    },
  ];

  return (
    <main className="uchit-premium">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`uchit-header ${
          scrolled ? "uchit-header-scrolled" : ""
        }`}
      >
        <Link
          href="/"
          className="uchit-brand"
          onClick={() => setMenuOpen(false)}
        >
          UCHIT<span>.WEB</span>
        </Link>

        <nav
          className={`uchit-nav ${
            menuOpen ? "uchit-nav-open" : ""
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={
                activeSection === item.id
                  ? "uchit-nav-active"
                  : ""
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="https://wa.me/918882184445"
          target="_blank"
          rel="noopener noreferrer"
          className="uchit-header-cta"
        >
          START A PROJECT
          <ArrowUpRight size={15} />
        </a>

        <button
          type="button"
          className="uchit-mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="uchit-hero">

        <div className="uchit-hero-grid" />

        <div className="uchit-hero-inner">

          <div className="uchit-hero-layout">

            {/* =================================================
                LEFT HERO CONTENT
            ================================================= */}

            <div className="uchit-hero-copy">

              <motion.div
                className="uchit-hero-label"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                }}
              >
                <span />
                WEB DESIGN &amp; DEVELOPMENT
              </motion.div>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 70,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                WEBSITES
                <br />
                THAT
                <br />
                <em>GROW.</em>
              </motion.h1>


              <motion.p
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.35,
                }}
              >
                I design and develop modern websites
                that help businesses look professional,
                build trust and turn visitors into
                customers.
              </motion.p>


              <motion.div
                className="uchit-hero-buttons"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.55,
                }}
              >

                <a
                  href="#work"
                  className="uchit-button uchit-button-light"
                >
                  VIEW MY WORK
                  <ArrowDown size={16} />
                </a>

                <a
                  href="https://wa.me/918882184445"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="uchit-button uchit-button-dark"
                >
                  LET&apos;S TALK
                  <ArrowUpRight size={16} />
                </a>

              </motion.div>


              <div className="uchit-hero-services">

                <span>
                  WEB DESIGN
                </span>

                <i />

                <span>
                  DEVELOPMENT
                </span>

                <i />

                <span>
                  UI / UX
                </span>

                <i />

                <span>
                  MOTION
                </span>

              </div>

            </div>


            {/* =================================================
                RIGHT HERO ANIMATION
            ================================================= */}

            <div className="uchit-hero-animation">

              <div className="hero-animation-glow" />


              {/* OUTER RING */}

              <motion.div
                className="hero-animation-ring ring-one"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span />
              </motion.div>


              {/* MIDDLE RING */}

              <motion.div
                className="hero-animation-ring ring-two"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span />
              </motion.div>


              {/* INNER RING */}

              <motion.div
                className="hero-animation-ring ring-three"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span />
              </motion.div>


              {/* =================================================
                  CENTRAL U / W LOGO
              ================================================= */}

              <motion.div
                className="hero-monogram"
                animate={{
                  y: [0, -12, 0],
                  rotateX: [0, 4, 0],
                  rotateY: [0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >

                <div className="monogram-inner">

                  <span>
                    U
                  </span>

                  <b>
                    W
                  </b>

                </div>

                <div className="monogram-line" />

              </motion.div>


              {/* LIGHT BEAM */}

              <motion.div
                className="hero-light-beam"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />


              {/* PARTICLE 1 */}

              <motion.i
                className="hero-particle particle-one"
                animate={{
                  y: [0, -35, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />


              {/* PARTICLE 2 */}

              <motion.i
                className="hero-particle particle-two"
                animate={{
                  y: [0, 25, 0],
                  opacity: [0.2, 0.9, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />


              {/* PARTICLE 3 */}

              <motion.i
                className="hero-particle particle-three"
                animate={{
                  x: [0, 25, 0],
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />


              {/* LABELS */}

              <span className="hero-animation-label label-top">
                CREATIVE
              </span>

              <span className="hero-animation-label label-right">
                DIGITAL
              </span>

              <span className="hero-animation-label label-bottom">
                EXPERIENCE
              </span>

              <span className="hero-animation-label label-left">
                01 / 04
              </span>

            </div>

          </div>

        </div>


      </section>


      {/* =====================================================
          MARQUEE
      ===================================================== */}

      <div className="uchit-marquee">

        <div className="uchit-marquee-track">

          <span>
            WEB DESIGN
            <b>✦</b>
          </span>

          <span>
            DEVELOPMENT
            <b>✦</b>
          </span>

          <span>
            UI / UX
            <b>✦</b>
          </span>

          <span>
            MOTION
            <b>✦</b>
          </span>

          <span>
            RESPONSIVE
            <b>✦</b>
          </span>

          <span>
            CREATIVE DIGITAL
            <b>✦</b>
          </span>

          <span>
            WEB DESIGN
            <b>✦</b>
          </span>

          <span>
            DEVELOPMENT
            <b>✦</b>
          </span>

          <span>
            UI / UX
            <b>✦</b>
          </span>

          <span>
            MOTION
            <b>✦</b>
          </span>

          <span>
            RESPONSIVE
            <b>✦</b>
          </span>

          <span>
            CREATIVE DIGITAL
            <b>✦</b>
          </span>

        </div>

      </div>


      {/* =====================================================
          WORK
      ===================================================== */}

      <section
        id="work"
        className="uchit-section uchit-work"
      >

        <div className="uchit-section-top">

          <div>

            <span>
              01 / SELECTED WORK
            </span>

            <h2>
              RECENT
              <br />
              <em>PROJECTS.</em>
            </h2>

          </div>

          <p>
            A selection of digital experiences
            designed and developed for businesses.
          </p>

        </div>


        {projects.length > 0 ? (

          <div className="uchit-projects">

            {projects.map(
              (project, index) => (

                <motion.article
                  key={project.id}
                  className="uchit-project"
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                >
<a
  href={project.live_url}
  target="_blank"
  rel="noopener noreferrer"
  className="uchit-project-image"
  onMouseMove={(e) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

    e.currentTarget.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );

    e.currentTarget.style.setProperty(
      "--mouse-y",
      `${e.clientY - rect.top}px`
    );
  }}
>

                    {project.image_url ? (

                      <img
                        src={project.image_url}
                        alt={project.title}
                      />

                    ) : (

                      <div className="uchit-project-empty">
                        UCHIT.WEB
                      </div>

                    )}

                    <div className="uchit-project-hover">

                      <span>
                        VIEW PROJECT
                      </span>

                      <ArrowUpRight
                        size={24}
                      />

                    </div>

                    <small aria-hidden="true">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </small>

                  </a>


                  <div className="uchit-project-info">

                    <div>

                      <span>
                        {project.category ||
                          "WEBSITE"}
                      </span>

                      <h3>
                        {project.title}
                      </h3>

                      {project.description && (
                        <p>
                          {project.description}
                        </p>
                      )}

                    </div>


                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} live site`}
                    >
                      LIVE
                      <ArrowUpRight
                        size={17}
                      />
                    </a>

                  </div>

                </motion.article>

              )
            )}

          </div>

        ) : (

          <div className="uchit-no-projects">

            <span>
              YOUR NEXT PROJECT
            </span>

            <h3>
              COULD BE HERE.
            </h3>

            <a href="#contact">
              START A PROJECT
              <ArrowUpRight
                size={16}
              />
            </a>

          </div>

        )}

      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        id="services"
        className="uchit-section uchit-services"
      >

        <div className="uchit-section-top">

          <div>

            <span>
              02 / WHAT I DO
            </span>

            <h2>
              BUILT AROUND
              <br />
              <em>YOUR BUSINESS.</em>
            </h2>

          </div>

          <p>
            Everything needed to create a strong
            and professional digital presence.
          </p>

        </div>


        <div className="uchit-services-grid">

          {services.map(
            (service, index) => {

              const Icon = service.icon;

              return (
                <motion.div
                  key={service.number}
                  className="uchit-service"
                    data-number={service.number}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.6,
                  }}
                >

                  <div className="uchit-service-top">

                    <span>
                      {service.number}
                    </span>

                    <Icon size={20} />

                  </div>

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.description}
                  </p>

                  <div className="uchit-service-arrow">

                    <ArrowUpRight
                      size={18}
                    />

                  </div>

                </motion.div>
              );
            }
          )}

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="uchit-about"
      >

        <div className="uchit-about-number">
          03 / ABOUT
        </div>


        <div className="uchit-about-content">

          <div className="uchit-about-heading">

            <span>
              UCHIT.WEB
            </span>

            <h2>
              I BUILD
              <br />
              WEBSITES
              <br />
              <em>WITH PURPOSE.</em>
            </h2>

          </div>


          <div className="uchit-about-text">

            <p className="large">
              A website should do more than
              simply exist. It should make your
              business look credible, communicate
              clearly and give people a reason
              to choose you.
            </p>

            <p>
              That&apos;s what I focus on with every
              project — combining thoughtful design,
              modern development and subtle
              interactions to create digital
              experiences that actually work.
            </p>


            <div className="uchit-about-stats">

              <div>
                <strong>
                  100%
                </strong>

                <span>
                  RESPONSIVE
                </span>
              </div>

              <div>
                <strong>
                  UI/UX
                </strong>

                <span>
                  DESIGN FIRST
                </span>
              </div>

              <div>
                <strong>
                  FAST
                </strong>

                <span>
                  PERFORMANCE
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="uchit-section uchit-process">

        <div className="uchit-section-top">

          <div>

            <span>
              04 / PROCESS
            </span>

            <h2>
              SIMPLE.
              <br />
              <em>FOCUSED.</em>
            </h2>

          </div>

        </div>


        <div className="uchit-process-grid">

          {process.map(
            (item, index) => (

              <motion.div
                key={item.number}
                className="uchit-process-item"
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
              >

                <span>
                  {item.number}
                </span>

                <div className="uchit-process-line" />

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

              </motion.div>

            )
          )}

        </div>

      </section>


      {/* =====================================================
          PRICING
      ===================================================== */}
<section
  id="pricing"
  className="uchit-section uchit-pricing"
>
  <div className="uchit-section-top">
    <div>
      <span>05 / WEBSITE SOLUTIONS</span>

      <h2>
        FIND YOUR
        <br />
        <em>WEBSITE.</em>
      </h2>
    </div>

    <p>
      Different businesses need different
      websites. Choose the solution that
      fits your goals.
    </p>
  </div>

  <div className="uchit-pricing-grid">
    {pricing.map((plan, index) => (
      <motion.div
        key={plan.name}
        className={`uchit-price ${
          plan.featured
            ? "uchit-price-featured"
            : ""
        }`}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          delay: index * 0.06,
          duration: 0.6,
        }}
      >
        {plan.featured && (
          <div className="uchit-popular">
            MOST POPULAR
          </div>
        )}

        <div className="uchit-price-number">
          {plan.number}
        </div>

        <span className="uchit-price-name">
          {plan.name}
        </span>

        <h3>{plan.price}</h3>

        <p className="uchit-price-description">
          {plan.description}
        </p>

        <div className="uchit-price-best">
          <span>BEST FOR</span>
          <strong>{plan.bestFor}</strong>
        </div>

        <div className="uchit-price-line" />

        <ul>
          {plan.features.map((feature) => (
            <li key={feature}>
              <Check size={14} />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={`https://wa.me/918882184445?text=${encodeURIComponent(
            `Hi Uchit, I'm interested in a ${plan.name} website. I'd like to discuss my requirements.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          GET STARTED
          <ArrowUpRight size={16} />
        </a>
      </motion.div>
    ))}
  </div>

  <div className="uchit-custom-pricing">
    <div>
      <span>NOT SURE WHAT YOU NEED?</span>

      <h3>
        LET&apos;S FIND THE RIGHT
        <br />
        <em>WEBSITE FOR YOU.</em>
      </h3>
    </div>

    <a
      href="https://wa.me/918882184445?text=Hi%20Uchit%2C%20I%27d%20like%20help%20choosing%20the%20right%20website%20for%20my%20business."
      target="_blank"
      rel="noopener noreferrer"
    >
      GET A FREE QUOTE
      <ArrowUpRight size={18} />
    </a>
  </div>

  <div className="uchit-pricing-note">
    <span>*</span>
    Final pricing depends on pages, functionality,
    integrations and custom requirements.
  </div>
</section>


      {/* =====================================================
          CONTACT
      ===================================================== */}
<section id="contact" className="uchit-contact">
  <div className="uchit-contact-inner">

    <div className="uchit-contact-label">
      06 / START A PROJECT
    </div>

    <h2>
      HAVE AN IDEA?
      <span>LET&apos;S BUILD IT.</span>
    </h2>

    <p>
      Tell me about your business and what you want your website to achieve.
    </p>

    <div className="uchit-contact-main">

      <a
        href="mailto:uchitmishra01@gmail.com"
        className="uchit-contact-email"
      >
        uchitmishra01@gmail.com
        <ArrowUpRight size={22} strokeWidth={2} />
      </a>

      <div className="uchit-contact-buttons">

        <a
          href="mailto:uchitmishra01@gmail.com"
          className="uchit-contact-primary"
        >
          <span>START A PROJECT</span>
          <ArrowUpRight size={16} />
        </a>

        <a
          href="https://wa.me/918882184445"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={17} />
          <span>WHATSAPP</span>
          <ArrowUpRight size={15} />
        </a>
<a
  href="https://www.instagram.com/uchit.web/"
  target="_blank"
  rel="noopener noreferrer"
>
  <span className="uchit-instagram-icon">◎</span>
  <span>INSTAGRAM</span>
  <ArrowUpRight size={15} />
</a>

      </div>
    </div>

    <div className="uchit-contact-decoration">
      UCHIT.WEB
    </div>

  </div>
</section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
<footer className="uchit-footer">

  <div>
    <strong>UCHIT.WEB</strong>

    <span>
      WEBSITES THAT GROW BUSINESSES.
    </span>
  </div>

  <div className="uchit-footer-links">
    <a href="#work">WORK</a>
    <a href="#services">SERVICES</a>
    <a href="#about">ABOUT</a>
    <a href="#pricing">PRICING</a>
    <a href="#contact">CONTACT</a>
  </div>

  <div className="uchit-footer-right">
    © 2026 UCHIT.WEB
  </div>

</footer>
    </main>
  );
}
