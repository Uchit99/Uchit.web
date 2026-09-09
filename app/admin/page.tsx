"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  live_url: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    }

    if (data) {
      setProjects(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      await loadProjects();
    }

    checkUser();
  }, [router]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategory("");
    setLiveUrl("");
    setImageUrl("");
    setImageFile(null);
    setEditingId(null);
  }

  async function uploadImage(file: File) {
    setUploadingImage(true);

    const fileExt = file.name.split(".").pop()?.toLowerCase();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const filePath = `projects/${fileName}`;

    const { error } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      alert(`Image upload failed: ${error.message}`);
      setUploadingImage(false);
      return null;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    setUploadingImage(false);

    return data.publicUrl;
  }

  async function saveProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !liveUrl.trim()) {
      alert("Project name and live website URL are required.");
      return;
    }

    setSaving(true);

    let finalImageUrl = imageUrl;

    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);

      if (!uploadedUrl) {
        setSaving(false);
        return;
      }

      finalImageUrl = uploadedUrl;
    }

    if (editingId) {
      const { error } = await supabase
        .from("projects")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          live_url: liveUrl.trim(),
          image_url: finalImageUrl || null,
        })
        .eq("id", editingId);

      if (error) {
        alert(`Update failed: ${error.message}`);
        setSaving(false);
        return;
      }

      alert("Project updated successfully.");
    } else {
      const { error } = await supabase
        .from("projects")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || null,
          live_url: liveUrl.trim(),
          image_url: finalImageUrl || null,
          published: true,
        });

      if (error) {
        alert(`Project could not be added: ${error.message}`);
        setSaving(false);
        return;
      }

      alert("Project added successfully.");
    }

    resetForm();
    await loadProjects();

    setSaving(false);
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description || "");
    setCategory(project.category || "");
    setLiveUrl(project.live_url);
    setImageUrl(project.image_url || "");
    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteProject(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Delete failed: ${error.message}`);
      return;
    }

    setProjects((current) =>
      current.filter((project) => project.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  async function togglePublished(
    id: string,
    currentStatus: boolean
  ) {
    const { error } = await supabase
      .from("projects")
      .update({
        published: !currentStatus,
      })
      .eq("id", id);

    if (error) {
      alert(`Status update failed: ${error.message}`);
      return;
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              published: !currentStatus,
            }
          : project
      )
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setImageFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be smaller than 5MB.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <div className="admin-brand">
            UCHIT.WEB
          </div>

          <div className="admin-subtitle">
            PORTFOLIO MANAGEMENT
          </div>
        </div>

        <div className="admin-header-actions">
          <a
            href="/projects"
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW WEBSITE ↗
          </a>

          <button onClick={logout}>
            LOG OUT
          </button>
        </div>
      </header>

      <section className="admin-container">
        <div className="admin-title-row">
          <div>
            <p className="admin-eyebrow">
              DASHBOARD / PROJECTS
            </p>

            <h1>
              MANAGE
              <br />
              <span>PROJECTS.</span>
            </h1>
          </div>

          <div className="admin-count">
            <strong>{projects.length}</strong>
            <span>PROJECTS</span>
          </div>
        </div>

        <section className="admin-add-card">
          <div className="admin-section-heading">
            <span>01</span>

            <h2>
              {editingId
                ? "EDIT PROJECT"
                : "ADD NEW PROJECT"}
            </h2>
          </div>

          <form
            onSubmit={saveProject}
            className="admin-form"
          >
            <div className="admin-form-grid">
              <label>
                PROJECT NAME *

                <input
                  type="text"
                  placeholder="Royal Fitness Club"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                />
              </label>

              <label>
                CATEGORY

                <input
                  type="text"
                  placeholder="Business Website"
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                />
              </label>

              <label className="admin-full">
                LIVE WEBSITE URL *

                <input
                  type="url"
                  placeholder="https://example.com"
                  value={liveUrl}
                  onChange={(e) =>
                    setLiveUrl(e.target.value)
                  }
                  required
                />
              </label>

              <label className="admin-full">
                DESCRIPTION

                <textarea
                  placeholder="A short description of the project..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={4}
                />
              </label>

              <label className="admin-full">
                PROJECT IMAGE

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                {imageFile && (
                  <p
                    style={{
                      marginTop: "10px",
                      color: "#8b5cf6",
                      fontSize: "11px",
                    }}
                  >
                    SELECTED: {imageFile.name}
                  </p>
                )}

                {imageUrl && !imageFile && (
                  <div
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    <p
                      style={{
                        color: "#777",
                        fontSize: "11px",
                        marginBottom: "10px",
                      }}
                    >
                      CURRENT IMAGE
                    </p>

                    <img
                      src={imageUrl}
                      alt="Current project"
                      style={{
                        width: "180px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #292929",
                      }}
                    />
                  </div>
                )}
              </label>
            </div>

            <div className="admin-form-buttons">
              <button
                type="submit"
                className="admin-add-button"
                disabled={saving || uploadingImage}
              >
                {uploadingImage
                  ? "UPLOADING IMAGE..."
                  : saving
                  ? editingId
                    ? "UPDATING..."
                    : "ADDING PROJECT..."
                  : editingId
                  ? "✓ UPDATE PROJECT"
                  : "＋ ADD PROJECT"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-projects-section">
          <div className="admin-section-heading">
            <span>02</span>
            <h2>YOUR PROJECTS</h2>
          </div>

          {loading ? (
            <div className="admin-empty">
              LOADING PROJECTS...
            </div>
          ) : projects.length === 0 ? (
            <div className="admin-empty">
              NO PROJECTS YET.
              <br />
              ADD YOUR FIRST PROJECT ABOVE.
            </div>
          ) : (
            <div className="admin-project-list">
              {projects.map((project, index) => (
                <article
                  className="admin-project-card"
                  key={project.id}
                >
                  <div className="admin-project-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {project.image_url && (
                    <div
                      style={{
                        width: "100px",
                        height: "70px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        border: "1px solid #292929",
                      }}
                    >
                      <img
                        src={project.image_url}
                        alt={project.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}

                  <div className="admin-project-info">
                    <div className="admin-project-category">
                      {project.category || "PROJECT"}
                    </div>

                    <h3>{project.title}</h3>

                    {project.description && (
                      <p>{project.description}</p>
                    )}

                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      OPEN LIVE WEBSITE ↗
                    </a>
                  </div>

                  <div className="admin-project-actions">
                    <button
                      onClick={() =>
                        togglePublished(
                          project.id,
                          project.published
                        )
                      }
                      className={
                        project.published
                          ? "published"
                          : "unpublished"
                      }
                    >
                      {project.published
                        ? "● PUBLISHED"
                        : "○ HIDDEN"}
                    </button>

                    <button
                      onClick={() =>
                        editProject(project)
                      }
                      className="edit-button"
                    >
                      EDIT
                    </button>

                    <button
                      onClick={() =>
                        deleteProject(project.id)
                      }
                      className="delete-button"
                    >
                      DELETE
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}