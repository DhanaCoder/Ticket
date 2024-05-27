"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTicketForm = ({ ticket }) => {
  const EDITMODE = ticket._id !== "new";
  const router = useRouter();
  const { data: session } = useSession();

  const startingTicketData = {
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "not started",
    category: "",
    email: session?.user?.email || "",
    department: "",
    assignedTo: [],
  };

  if (EDITMODE) {
    startingTicketData.title = ticket.title;
    startingTicketData.description = ticket.description;
    startingTicketData.priority = ticket.priority;
    startingTicketData.progress = ticket.progress;
    startingTicketData.status = ticket.status;
    startingTicketData.category = ticket.category;
    startingTicketData.assignedTo = ticket.assignedTo || [];
    startingTicketData.email = ticket.email; // Ensure the original creator's email is retained
  }

  const [formData, setFormData] = useState(startingTicketData);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "https://stagingapi.rekonsys.tech/all-projects"
        );
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

  useEffect(() => {
    const fetchUserDepartment = async () => {
      if (!EDITMODE) return;

      try {
        const res = await fetch(`https://api.rekonsys.tech/auth/users`);
        if (!res.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await res.json();
        console.log("User department data:", data); // Log the response
        if (data && data.length > 0) {
          const user = data.find((user) => user.email === ticket.email);
          if (user && user.department) {
            setFormData((prevState) => ({
              ...prevState,
              department: user.department,
            }));
          } else {
            console.error("Department not found for the user");
          }
        } else {
          console.error("No users found");
        }
      } catch (error) {
        console.error("Error fetching user department:", error);
      }
    };

    fetchUserDepartment();
  }, [EDITMODE, ticket.email]);

  const fetchTeamMembers = async (projectName) => {
    const selectedProject = projects.find(
      (project) => project.projectname === projectName
    );
    if (selectedProject) {
      if (selectedProject.teamMembers.length > 0) {
        setTeamMembers(
          selectedProject.teamMembers.map((member) => ({
            value: member,
            label: member,
          }))
        );
      } else {
        try {
          const res = await fetch("https://api.rekonsys.tech/auth/users");
          if (!res.ok) {
            throw new Error("Failed to fetch team members");
          }
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const userEmails = data.map((user) => ({
              value: user.email,
              label: user.email,
            }));
            setTeamMembers(userEmails);
          } else {
            console.error("No user emails found in the response.");
          }
        } catch (error) {
          console.error("Error fetching team members:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (EDITMODE) {
      fetchTeamMembers(formData.category);
    }
  }, [projects, EDITMODE, formData.category]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Update the form data
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // If the status is "done", set progress to 100
    if (name === "status" && value === "done") {
      setFormData((prevState) => ({
        ...prevState,
        progress: 100,
        doneBy: { email: session?.user?.email, name: session?.user?.name }, // Set doneBy
      }));
    } else if (name === "status" && value === "started") {
      setFormData((prevState) => ({
        ...prevState,
        progress: 50,
        doneBy: null, // Reset doneBy
      }));
    } else if (name === "status" && value !== "done") {
      setFormData((prevState) => ({
        ...prevState,
        progress: 0,
        doneBy: null, // Reset doneBy
      }));
    }

    // Update team members when a project is selected
    if (name === "category") {
      fetchTeamMembers(value);
    }
  };

 
    const handleMultiSelectChange = (selectedOptions) => {
      const selectedEmails = selectedOptions.map((option) => option.value);
      if (selectedEmails.length > 10) {
        return;
      }
      setFormData((prevState) => ({
        ...prevState,
        assignedTo: selectedEmails,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validation: Ensure at least one person is assigned
      if (formData.assignedTo.length === 0) {
        toast.error("Please assign at least one person to the ticket.");
        return;
      }
  
      try {
        const formDataWithDoneBy = {
          ...formData,
          email: session?.user?.email || formData.email, // Ensure email is set
          doneBy:
            formData.status === "done" && formData.progress === 100
              ? { email: session?.user?.email, name: session?.user?.name }
              : null,
        };
  
        if (EDITMODE) {
          const res = await fetch(`/api/Tickets/${ticket._id}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ formData: formDataWithDoneBy }),
          });
          if (!res.ok) {
            throw new Error("Failed to update ticket");
          }
          toast.success("Ticket updated successfully!");
        } else {
          const res = await fetch("/api/Tickets", {
            method: "POST",
            body: JSON.stringify({ formData: formDataWithDoneBy }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!res.ok) {
            throw new Error("Failed to create ticket");
          }
          toast.success("Ticket created successfully!");
        }
  
        setTimeout(() => {
          router.refresh();
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Error submitting ticket:", error);
        toast.error("Failed to submit ticket.");
      }
    };
  
    return (
      <div className="flex justify-center px-4 sm:px-6 lg:px-8">
        <ToastContainer />
        <form
          onSubmit={handleSubmit}
          method="post"
          className="flex flex-col gap-3 w-full max-w-lg"
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
            className="p-2 border rounded w-full"
          />
  
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            required={true}
            value={formData.description}
            rows="5"
            className="p-2 border rounded w-full"
          />
  
          <label htmlFor="category">Project</label>
          {!EDITMODE ? (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects?.map((project) => (
                <option key={project._id} value={project.projectname}>
                  {project.projectname}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              className="p-2 border rounded w-full"
              readOnly
            />
          )}
  
          {teamMembers.length > 0 && (
            <>
              <label htmlFor="assignedTo">Assign To</label>
              <Select
                name="assignedTo"
                isMulti
                options={teamMembers}
                value={teamMembers.filter((member) =>
                  formData.assignedTo.includes(member.value)
                )}
                onChange={handleMultiSelectChange}
                className="p-2 border rounded w-full"
                isDisabled={!EDITMODE || formData.email !== session?.user?.email}
              />
            </>
          )}
  
          <label>Priority</label>
          <div className="flex gap-2">
            {[5, 4, 3, 2, 1].map((priority) => (
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
            className="p-2 border rounded w-full"
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
  