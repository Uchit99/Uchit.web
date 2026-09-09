"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Monitor } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  live_url: string;
  image_url: string | null;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, description, category, live_url, image_url"
        )
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Projects error:", error);
      }

      if (data) {
        setProjects(data);
      }

      setLoading(false);
    }

    loadProjects();
  }, []);

  return (
    <main className="premium-projects-page">

      {/* NAVIGATION */}

      <nav className="projects-nav">
        <Link href="/" className="projects-logo">
          UCHIT<span>.WEB</span>
        </Link>

        <Link href="/" className="projects-back">
          <ArrowLeft size={15} />
          BACK HOME
        </Link>
      </nav>

      {/* HERO */}

      <section className="projects-hero-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="projects-eyebrow">
            UCHIT.WEB / SELECTED WORK
          </p>

          <h1>
            SELECTED
            <br />
            <span>PROJECTS.</span>
          </h1>

          <p className="projects-description">
            A collection of websites and digital experiences
            built for modern businesses, brands and ideas.
          </p>
        </motion.div>

        <div className="projects-hero-count">
          <span>AVAILABLE WORK</span>
          <strong>
            {String(projects.length).padStart(2, "0")}
          </strong>
          <span>PROJECTS</span>
        </div>
      </section>

      {/* PROJECT LIST */}

      <section className="premium-project-list">

        {loading ? (
          <div className="projects-status">
            <div className="projects-loader" />
            LOADING PROJECTS...
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-status">
            <Monitor size={35} />
            <span>NO PROJECTS PUBLISHED YET.</span>
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.article
              className="premium-project"
              key={project.id}
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
              }}
            >
              <div className="premium-project-top">
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>
                  {project.category || "WEB DEVELOPMENT"}
                </span>

                <span>
                  {String(
                    new Date().getFullYear()
                  )}
                </span>
              </div>

              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-project-image"
              >
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                  />
                ) : (
                  <div className="premium-image-placeholder">
                    <Monitor size={45} />
                    <span>UCHIT.WEB</span>
                  </div>
                )}

                <div className="premium-project-overlay">
                  <div>
                    <span>VIEW LIVE PROJECT</span>
                    <ArrowUpRight size={25} />
                  </div>
                </div>
              </a>

              <div className="premium-project-bottom">
                <div>
                  <h2>{project.title}</h2>

                  {project.description && (
                    <p>{project.description}</p>
                  )}
                </div>

                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-live-button"
                >
                  LIVE WEBSITE
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </motion.article>
          ))
        )}

      </section>

      {/* BOTTOM CTA */}

      <section className="projects-bottom-cta">
        <p>HAVE A PROJECT IN MIND?</p>

        <h2>
          LET&apos;S
          <br />
          <span>BUILD.</span>
        </h2>

        <div className="projects-cta-links">
          <a href="mailto:uchitmishra01@gmail.com">
            EMAIL ME
            <ArrowUpRight size={18} />
          </a>

          <a
            href="https://wa.me/918882184445"
            target="_blank"
            rel="noopener noreferrer"
          >
            WHATSAPP
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <footer className="projects-footer">
        <span>UCHIT.WEB</span>
        <span>WEBSITES THAT GROW BUSINESSES.</span>
      </footer>

    </main>
  );
}