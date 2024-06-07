"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./Nav";

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
    startingTicketData.email = ticket.email;
  }

  const [formData, setFormData] = useState(startingTicketData);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PROJECT_URL}/all-projects`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await res.json();
        setProjects(data);
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PROJECT_URL}/auth/users`
        );
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

  useEffect(() => {
    if (EDITMODE) {
      const selectedProject = projects.find(
        (project) => project.projectname === ticket.category
      );
      if (selectedProject && selectedProject.teamMembers.length > 0) {
        setTeamMembers(selectedProject.teamMembers);
      }
    }
  }, [EDITMODE, ticket.category, projects]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "status" && value === "solved") {
      setFormData((prevState) => ({
        ...prevState,
        progress: 100,
        doneBy: { email: session?.user?.email, name: session?.user?.name },
      }));
      toast.warn("Check before submitting");
    } else if (name === "status" && value === "started") {
      setFormData((prevState) => ({
        ...prevState,
        progress: 50,
        doneBy: null,
      }));
    } else if (name === "status" && value !== "done") {
      setFormData((prevState) => ({
        ...prevState,
        progress: 0,
        doneBy: null,
      }));
    } else if (name === "status" && value === "reopened") {
      setFormData((prevState) => ({
        ...prevState,
        progress: 25,
        doneBy: null,
      }));
      toast.info("Ticket reopened");
    }

    if (name === "category") {
      const selectedProject = projects.find(
        (project) => project.projectname === value
      );
      if (selectedProject) {
        if (selectedProject.teamMembers.length > 0) {
          setTeamMembers(selectedProject.teamMembers);
          console.log(selectedProject.teamMembers);
        } else {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_PROJECT_URL}/auth/users`
            );
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
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const selectedEmails = selectedOptions.map((option) => option.value);

    if (selectedEmails.length > 10) {
      toast.error("You cannot assign more than 10 users to a ticket.");
      return;
    }

    if (selectedEmails.includes(session.user.email)) {
      toast.error(
        "You cannot assign the ticket creator's email to the ticket."
      );
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      assignedTo: selectedEmails,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      (EDITMODE && !formData.department) ||
      formData.assignedTo.length === 0
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const formDataWithDoneBy = {
        ...formData,
        email: session?.user?.email || formData.email,
        doneBy:
          formData.status === "solved" && formData.progress === 100
            ? { email: session?.user?.email, name: session?.user?.name }
            : null,
      };

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

  const isCreator = session?.user?.email === ticket.email;

  return (
    <div>
      <Nav />
      <div className="flex justify-center">
        <ToastContainer />
        <form
          onSubmit={handleSubmit}
          method="post"
          className="flex flex-col gap-3 w-1/2"
        >
          <h3 className="flex flex-row gap-10">
            {EDITMODE ? "Update Your Ticket" : "Create New Ticket"}
          </h3>

          <label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={handleChange}
            required={true}
            value={formData.title}
            className="p-2 border rounded"
          />

          <label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            required={true}
            value={formData.description}
            rows="5"
            className="p-2 border rounded"
          />

          {!EDITMODE || isCreator ? (
            <>
              <label htmlFor="category">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-2 border rounded"
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

              {teamMembers.length > 0 && (
                <>
                  <label htmlFor="assignedTo">
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="assignedTo"
                    isMulti
                    options={teamMembers}
                    value={teamMembers.filter((member) =>
                      formData.assignedTo.includes(member.value)
                    )}
                    onChange={handleMultiSelectChange}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </>
              )}
            </>
          ) : (
            <>
              <label htmlFor="category">
                Project <span className="text-red-500">*</span>
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                className="p-2 border rounded"
                readOnly
              />

              {teamMembers.length > 0 && (
                <>
                  <label htmlFor="assignedTo">
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="assignedTo"
                    name="assignedTo"
                    type="text"
                    value={formData.assignedTo.join(", ")} // Assuming assignedTo is an array
                    className="p-2 border rounded"
                    readOnly
                  />
                </>
              )}
            </>
          )}

          <label>
            Priority <span className="text-red-500">*</span>
          </label>
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

          <label htmlFor="progress">
            Progress <span className="text-red-500">*</span>
          </label>
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

          <label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="not started">Not Started</option>
            <option value="started">Started</option>
            {EDITMODE && <option value="solved">Solved</option>}
            {EDITMODE && isCreator && (
              <option value="reopened">Reopened</option>
            )}
          </select>

          <button
            type="submit"
            className="hover:bg-blue-500 bg-gray-500 text-white p-2 rounded"
          >
            {EDITMODE ? "Update Ticket" : "Create Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTicketForm;
