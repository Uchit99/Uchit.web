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
    details: ["Brand-led visual direction", "Clear page hierarchy", "Polished layouts for every screen"],
    icon: PenTool,
  },
  {
    number: "02",
    title: "DEVELOPMENT",
    description:
      "Fast, responsive websites built with modern technology and clean structure.",
    details: ["Responsive page development", "Reliable forms and integrations", "Performance-minded implementation"],
    icon: Code2,
  },
  {
    number: "03",
    title: "UI / UX",
    description:
      "Simple interfaces and intuitive experiences that make websites easy to use.",
    details: ["Easy-to-follow navigation", "Thoughtful mobile experiences", "Accessible interaction patterns"],
    icon: Smartphone,
  },
  {
    number: "04",
    title: "MOTION",
    description:
      "Purposeful animation and interactions that make the experience feel alive.",
    details: ["Subtle interface feedback", "Smooth page transitions", "Motion that supports the content"],
    icon: Sparkles,
  },
];

const process = [
  {
    number: "01",
    title: "DISCOVER",
    text: "We understand your business, audience and goals.",
    details: ["Clarify your business goals", "Understand your audience", "Plan pages and project scope"],
    longDescription: "We start by learning what your business does, who the site needs to reach, and what a successful result looks like. That gives the project a clear direction before design begins.",
  },
  {
    number: "02",
    title: "DESIGN",
    text: "I create the visual direction and user experience.",
    details: ["Set the visual direction", "Arrange content around visitor needs", "Review layouts before development"],
    longDescription: "The design phase turns the project goals into a clear visual system. We shape the page structure, typography, colors, and key interactions so the experience feels consistent and easy to use.",
  },
  {
    number: "03",
    title: "BUILD",
    text: "The approved design becomes a fast working website.",
    details: ["Build responsive pages", "Connect forms and agreed integrations", "Refine details across screen sizes"],
    longDescription: "Once the design direction is approved, I build the website and connect the agreed functionality. The work is reviewed across desktop and mobile so the finished experience feels cohesive.",
  },
  {
    number: "04",
    title: "LAUNCH",
    text: "Your website goes live and starts working for your business.",
    details: ["Prepare the final content", "Check links and key interactions", "Publish the finished website"],
    longDescription: "Before launch, we check the important pages and interactions, then publish the finished website. You get a polished handoff and a clear next step for maintaining your site.",
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<(typeof process)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("work");

  useEffect(() => {
    if (!selectedProject && !selectedService && !selectedProcess) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
        setSelectedService(null);
        setSelectedProcess(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProject, selectedService, selectedProcess]);

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
          onClick={(event) => {
            setMenuOpen(false);
            if (window.location.pathname === "/") {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
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
<button
  type="button"
  className="uchit-project-image project-image-trigger"
  aria-label={`View details for ${project.title}`}
  onClick={() => setSelectedProject(project)}
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
                        VIEW DETAILS
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

                  </button>


                  <div className="uchit-project-info">

                    <div>

                      <span>
                        {project.category ||
                          "WEBSITE"}
                      </span>

                      <h3>
                        {project.title}
                      </h3>

                      <button
                        type="button"
                        className="project-description-trigger"
                        onClick={() => setSelectedProject(project)}
                      >
                        PROJECT DETAILS <ArrowUpRight size={14} />
                      </button>

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
      ABOUT
      ===================================================== */}

      <section id="about" className="uchit-section uchit-services uchit-about-services">

        <div className="uchit-section-top">

          <div>

            <span>
              02 / ABOUT
            </span>

            <h2>
              DESIGN WITH
              <br />
              <em>PURPOSE.</em>
            </h2>

          </div>

          <p>
            I design and build thoughtful digital experiences that help businesses look credible, communicate clearly, and turn visitors into customers.
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
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${service.title} service details`}
                  onClick={() => setSelectedService(service)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedService(service);
                    }
                  }}
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
          PROCESS
      ===================================================== */}

      <section className="uchit-section uchit-process">

        <div className="uchit-section-top">

          <div>

            <span>
              03 / PROCESS
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
                role="button"
                tabIndex={0}
                aria-label={`View details for ${item.title.toLowerCase()} phase`}
                onClick={() => setSelectedProcess(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedProcess(item);
                  }
                }}
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

                <span className="process-card-link">EXPLORE PHASE <ArrowUpRight size={14} /></span>

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
      <span>04 / WEBSITE SOLUTIONS</span>

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
      05 / START A PROJECT
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
    <a href="#about">ABOUT</a>
    <a href="#pricing">PRICING</a>
    <a href="#contact">CONTACT</a>
  </div>

      <div className="uchit-footer-right">
    © 2026 UCHIT.WEB
  </div>

</footer>

      {(selectedProject || selectedService || selectedProcess) && (
        <motion.div
          className="project-detail-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
              setSelectedService(null);
              setSelectedProcess(null);
            }
          }}
        >
          {selectedProject ? (
            <motion.section
              className="project-detail-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-detail-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}
            >
              <button className="project-detail-close" type="button" aria-label="Close project details" onClick={() => setSelectedProject(null)}>
                <X size={18} />
              </button>
              <div
                className="project-detail-image"
                onPointerMove={(event) => {
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
                  const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
                  event.currentTarget.style.setProperty("--image-x", `${x}%`);
                  event.currentTarget.style.setProperty("--image-y", `${y}%`);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") {
                    event.currentTarget.style.setProperty("--image-x", "50%");
                    event.currentTarget.style.setProperty("--image-y", "50%");
                  }
                }}
              >
                {selectedProject.image_url ? (
                  <>
                    <img src={selectedProject.image_url} alt={selectedProject.title} draggable={false} />
                    <span className="project-image-pan-hint">MOVE OR DRAG TO EXPLORE</span>
                  </>
                ) : (
                  <div className="uchit-project-empty">UCHIT.WEB</div>
                )}
              </div>
              <div className="project-detail-content">
                <div className="project-detail-kicker"><span>{selectedProject.category || "WEBSITE"}</span><span>PROJECT</span></div>
                <h2 id="project-detail-title">{selectedProject.title}</h2>
                <p>{selectedProject.description || "A website project designed to give this business a clear, polished online presence."}</p>
                <a className="project-detail-visit" href={selectedProject.live_url} target="_blank" rel="noopener noreferrer">
                  VISIT LIVE WEBSITE <ArrowUpRight size={16} />
                </a>
                <div className="project-detail-note">
                  <span>PROJECT OVERVIEW</span>
                  <p>This project brings its content and visual identity together in one clear online experience.</p>
                </div>
              </div>
            </motion.section>
          ) : selectedService ? (
            <motion.section
              className="service-detail-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-detail-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}
            >
              <button className="project-detail-close" type="button" aria-label="Close service details" onClick={() => setSelectedService(null)}>
                <X size={18} />
              </button>
              <span className="service-detail-number">ABOUT / SERVICES / {selectedService.number}</span>
              <selectedService.icon className="service-detail-icon" size={28} />
              <h2 id="service-detail-title">{selectedService.title}</h2>
              <p>{selectedService.description}</p>
              <ul>
                {selectedService.details.map((detail) => (
                  <li key={detail}><Check size={15} />{detail}</li>
                ))}
              </ul>
              <a className="project-detail-visit" href={`https://wa.me/918882184445?text=${encodeURIComponent(`Hi Uchit, I'm interested in ${selectedService.title.toLowerCase()} for my website.`)}`} target="_blank" rel="noopener noreferrer">
                DISCUSS THIS SERVICE <ArrowUpRight size={16} />
              </a>
            </motion.section>
          ) : selectedProcess ? (
            <motion.section
              className="service-detail-card process-detail-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="process-detail-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}
            >
              <button className="project-detail-close" type="button" aria-label="Close process details" onClick={() => setSelectedProcess(null)}>
                <X size={18} />
              </button>
              <span className="service-detail-number">THE PROCESS / {selectedProcess.number}</span>
              <h2 id="process-detail-title">{selectedProcess.title}</h2>
              <p>{selectedProcess.longDescription}</p>
              <ul>
                {selectedProcess.details.map((detail) => (
                  <li key={detail}><Check size={15} />{detail}</li>
                ))}
              </ul>
              <a className="project-detail-visit" href="#contact" onClick={() => setSelectedProcess(null)}>
                START A PROJECT <ArrowUpRight size={16} />
              </a>
            </motion.section>
          ) : null}
        </motion.div>
      )}
    </main>
  );
}
