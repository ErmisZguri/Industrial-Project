import React, { useState, useEffect } from 'react';
import './Projects.css';
import { getProjects, addProject } from '../services/apiService'; // Import API service functions

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(); // Fetch projects from API
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load projects.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFavoriteClick = (project) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(project)
        ? prevFavorites.filter((fav) => fav !== project)
        : [...prevFavorites, project]
    );
  };

  const closePreview = () => {
    setSelectedProject(null);
  };

  const handleAddProject = async (newProject) => {
    try {
      const addedProject = await addProject(newProject); // Add project via API
      setProjects((prevProjects) => [...prevProjects, addedProject]); // Update state with the new project
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === '' || project.year === filter)
  );

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="projects-page">
      <h1 className="page-title">Our Projects</h1>

      {/* Add Project Form */}
      <div className="add-project-form">
        <h2>Add a New Project</h2>
        <AddProjectForm onAddProject={handleAddProject} />
      </div>

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select onChange={handleFilterChange} value={filter}>
          <option value="">All Years</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
        <button>Filter</button>
      </div>

      {/* Project Grid */}
      <div className="project-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-actions">
                <a href="#preview" onClick={() => handleProjectClick(project)}>View this project &gt;</a>
                <button
                  className="save-favorites"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteClick(project);
                  }}
                >
                  {favorites.includes(project) ? "Unfavorite" : "Save"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Preview Section */}
      {selectedProject && (
        <div className="project-preview" id="preview">
          <button className="close-preview" onClick={closePreview}>✕</button>
          <img src={selectedProject.image} alt={selectedProject.title} className="preview-image" />
          <div className="preview-info">
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.details}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;

// AddProjectForm Component
function AddProjectForm({ onAddProject }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      title,
      description,
      year,
      image,
    };
    onAddProject(newProject); // Pass the new project to parent
    setTitle('');
    setDescription('');
    setYear('');
    setImage('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-project-form">
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Year:
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </label>
      <label>
        Image URL:
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Project</button>
    </form>
  );
}
