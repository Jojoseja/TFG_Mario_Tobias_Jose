import { useParams, useOutletContext } from "react-router-dom";
import type { Project } from "../types/project";
import PomodoroTimer from "../components/PomodoroTimer";
import { useState } from "react";
import TaskManager from "../components/TaskManager";
import "../styles/ProjectPage.css";

type OutletContext = {
  projects: Project[];
};

type SessionStatus = "work" | "shortRest" | "longRest";

function ProjectPage() {
  const { projectId } = useParams();
  const { projects } = useOutletContext<OutletContext>();

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");
  
  const project = projects.find(
    (project) => project.id === Number(projectId)
  );

  if (!project) {
    return (
      <div>
        <h1>Proyecto no encontrado</h1>
      </div>
    );
  }

  return (
    <>
      <header>
          <h1>{project.name}</h1>
          <p>Aqui va la descripción del proyecto</p>
      </header>
      <section className="project-content">
        <div className="columna">
          <PomodoroTimer variant = "project" onModeChange={setSessionStatus} />
        </div>
        <div className="columna">
          <TaskManager variant="project"/>
        </div>
      </section>
    </>
  );
}

export default ProjectPage;