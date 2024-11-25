import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/apiService';
import AddProjectForm from './AddProjectForm';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            console.log("Fetching projects..."); // Debug log
            try {
                const data = await getProjects();
                console.log("Projects fetched:", data); // Debug log
                setProjects(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching projects:", err); // Debug log
                setError("Failed to load projects.");
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectAdded = (newProject) => {
        console.log("Adding new project:", newProject); // Debug log
        setProjects((prevProjects) => [...prevProjects, newProject]);
    };

    if (loading) return <div>Loading projects...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Projects</h1>
            <AddProjectForm onProjectAdded={handleProjectAdded} />
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <strong>{project.name}</strong> - {project.company} ({project.year})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectsPage;
