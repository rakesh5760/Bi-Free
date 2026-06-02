export const PROJECT_STAGES = [
  { code: "P0", title: "Project Allocated", description: "Project has been assigned to a mentor and student team." },
  { code: "P1", title: "Requirement Analysis", description: "Analyzing client requirements and determining scope." },
  { code: "P2", title: "Planning & Design", description: "Creating architecture, UI/UX designs, and technical planning." },
  { code: "P3", title: "Development Started", description: "Development phase has commenced." },
  { code: "P4", title: "25% Development Complete", description: "Core features are partially implemented." },
  { code: "P5", title: "50% Development Complete", description: "Half of the required features are completed." },
  { code: "P6", title: "75% Development Complete", description: "Major development is finished, entering final features." },
  { code: "P7", title: "Internal Review", description: "QA, testing, and mentor validation of the project." },
  { code: "P8", title: "Client Review", description: "Project presented to the client for feedback." },
  { code: "P9", title: "Revisions", description: "Addressing client feedback and making necessary revisions." },
  { code: "P10", title: "Project Delivered", description: "Final product has been successfully delivered to the client." },
  { code: "P11", title: "Project Closed", description: "Project is officially closed and archived." }
];

export const getStageIndex = (code: string) => {
  return PROJECT_STAGES.findIndex(stage => stage.code === code);
};
