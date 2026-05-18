import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../services/axiosClient";
import type { Project } from "../types/project";
import type { Task } from "../types/task";

export function ProjectsPage() {
  const queryClient = useQueryClient();

  const [projectName, setProjectName] = useState("");

  const [projectDescription, setProjectDescription] = useState("");

  const [taskTitle, setTaskTitle] = useState("");

  const [taskDescription, setTaskDescription] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState<number>();

  const projectsQuery = useQuery({
    queryKey: ["projects"],

    queryFn: async () => {
      const response = await api.get<Project[]>("/projects");

      return response.data;
    },
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks"],

    queryFn: async () => {
      const response = await api.get<Task[]>("/tasks");

      return response.data;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async () => {
      await api.post("/projects", {
        name: projectName,
        description: projectDescription,
      });
    },

    onSuccess: () => {
      setProjectName("");
      setProjectDescription("");

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProjectId) return;

      await api.post("/tasks", {
        title: taskTitle,
        description: taskDescription,
        status: "todo",
        project_id: selectedProjectId,
      });
    },

    onSuccess: () => {
      setTaskTitle("");
      setTaskDescription("");

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  return (
    <div
      className="
      p-8
      flex
      flex-col
      gap-8
    "
    >
      <h1
        className="
        text-3xl
        font-bold
      "
      >
        TaskFlow
      </h1>

      {/* CREATE PROJECT */}

      <div
        className="
        border
        rounded
        p-4
        flex
        flex-col
        gap-3
      "
      >
        <h2
          className="
          text-xl
          font-bold
        "
        >
          Create Project
        </h2>

        <input
          className="border p-2"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <textarea
          className="border p-2"
          placeholder="Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <button
          className="
            bg-black
            text-white
            p-2
          "
          onClick={() => createProjectMutation.mutate()}
        >
          Create Project
        </button>
      </div>

      {/* PROJECT LIST */}

      <div
        className="
        flex
        flex-col
        gap-4
      "
      >
        <h2
          className="
          text-xl
          font-bold
        "
        >
          Projects
        </h2>

        {projectsQuery.data?.map((project) => (
          <div
            key={project.id}
            className="
              border
              rounded
              p-4
            "
          >
            <h3
              className="
              font-bold
              text-lg
            "
            >
              {project.name}
            </h3>

            <p>{project.description}</p>
          </div>
        ))}
      </div>

      {/* CREATE TASK */}

      <div
        className="
        border
        rounded
        p-4
        flex
        flex-col
        gap-3
      "
      >
        <h2
          className="
          text-xl
          font-bold
        "
        >
          Create Task
        </h2>

        <select
          className="border p-2"
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
        >
          <option>Select Project</option>

          {projectsQuery.data?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2"
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <textarea
          className="border p-2"
          placeholder="Task description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        <button
          className="
            bg-black
            text-white
            p-2
          "
          onClick={() => createTaskMutation.mutate()}
        >
          Create Task
        </button>
      </div>

      {/* TASK LIST */}

      <div
        className="
        flex
        flex-col
        gap-4
      "
      >
        <h2
          className="
          text-xl
          font-bold
        "
        >
          Tasks
        </h2>

        {tasksQuery.data?.map((task) => (
          <div
            key={task.id}
            className="
              border
              rounded
              p-4
            "
          >
            <h3
              className="
              font-bold
            "
            >
              {task.title}
            </h3>

            <p>{task.description}</p>

            <span
              className="
              text-sm
              text-gray-500
            "
            >
              Status: {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
