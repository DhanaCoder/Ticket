"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const EditTicketForm = ({ ticket }) => {
  const EDITMODE = ticket._id !== "new";
  const router = useRouter();
  const { data: session, status } = useSession();
  const startingTicketData = {
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "not started",
    category: "",
    email: session?.user?.email || '',
    assignedTo: ""
  };

  if (EDITMODE) {
    startingTicketData["title"] = ticket.title;
    startingTicketData["description"] = ticket.description;
    startingTicketData["priority"] = ticket.priority;
    startingTicketData["progress"] = ticket.progress;
    startingTicketData["status"] = ticket.status;
    startingTicketData["category"] = ticket.category;
    startingTicketData["assignedTo"] = ticket.assignedTo || "";
  }

  const [formData, setFormData] = useState(startingTicketData);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://stagingapi.rekonsys.tech/all-projects");
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await res.json();
        setProjects(data); // Assuming the projects are directly in the data array
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      email: session?.user?.email || prevState.email,
      [name]: value,
    }));

    // Update team members when a project is selected
    if (name === "category") {
      const selectedProject = projects.find(
        (project) => project.projectname === value
      );
      setTeamMembers(selectedProject ? selectedProject.teamMembers : []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (EDITMODE) {
        const res = await fetch(`/api/Tickets/${ticket._id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ formData }),
        });
        if (!res.ok) {
          throw new Error("Failed to update ticket");
        }
      } else {
        const res = await fetch("/api/Tickets", {
          method: "POST",
          body: JSON.stringify({ formData }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to create ticket");
        }
      }

      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h3>{EDITMODE ? "Update Your Ticket" : "Create New Ticket"}</h3>
        
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title}
          className="p-2 border rounded"
        />
        
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required={true}
          value={formData.description}
          rows="5"
          className="p-2 border rounded"
        />
        
        <label htmlFor="category">Project</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="" disabled>Select a project</option>
          {projects?.map((project) => (
            <option key={project._id} value={project.projectname}>
              {project.projectname}
            </option>
          ))}
        </select>

        {teamMembers.length > 0 && (
          <>
            <label htmlFor="assignedTo">Assign To</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="" disabled>Select a team member</option>
              {teamMembers.map((member, index) => (
                <option key={index} value={member.value}>
                  {member.label}
                </option>
              ))}
            </select>
          </>
        )}

        <label>Priority</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((priority) => (
            <div key={priority} className="flex items-center gap-1">
              <input
                id={`priority-${priority}`}
                name="priority"
                type="radio"
                onChange={handleChange}
                value={priority}
                checked={formData.priority == priority}
              />
              <label htmlFor={`priority-${priority}`}>{priority}</label>
            </div>
          ))}
        </div>

        <label htmlFor="progress">Progress</label>
        <input
          type="range"
          id="progress"
          name="progress"
          value={formData.progress}
          min="0"
          max="100"
          onChange={handleChange}
          className="w-full"
        />

        <label htmlFor="status">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="not started">Not Started</option>
          <option value="started">Started</option>
          <option value="done">Done</option>
        </select>

        <input
          type="submit"
          className="btn max-w-xs p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          value={EDITMODE ? "Update Ticket" : "Create Ticket"}
        />
      </form>
    </div>
  );
};

export default EditTicketForm;
