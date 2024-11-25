import React, { useState } from 'react';
import { addProject } from '../services/apiService';

const AddProjectForm = ({ onProjectAdded }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form..."); // Debug log
        try {
            const newProject = { name, company, year };
            const addedProject = await addProject(newProject);
            console.log("Project added:", addedProject); // Debug log
            onProjectAdded(addedProject);
            setName('');
            setCompany('');
            setYear('');
        } catch (err) {
            console.error("Error adding project:", err); // Debug log
            setError("Failed to add project.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div>{error}</div>}
            <label>
                Project Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            <label>
                Company:
                <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                />
            </label>
            <label>
                Year:
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Add Project</button>
        </form>
    );
};

export default AddProjectForm;
