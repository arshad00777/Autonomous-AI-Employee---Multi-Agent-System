export type AgentName =
  | "Research Agent"
  | "Coding Agent"
  | "Data Analyst Agent"
  | "Email Agent"
  | "Report Agent";

export type AgentStep = {
  agent: AgentName;
  purpose: string;
};

export function chooseAgents(task: string): AgentStep[] {
  const t = task.toLowerCase();
  const steps: AgentStep[] = [];
  if (/research|competitor|market|industry|compare|find out|investigate/.test(t)) {
    steps.push({ agent: "Research Agent", purpose: "Break down the request and prepare a structured research brief." });
  }
  if (/code|bug|debug|function|api|website|software|program|script|build|develop/.test(t)) {
    steps.push({ agent: "Coding Agent", purpose: "Create or review a practical software solution." });
  }
  if (/data|csv|excel|spreadsheet|sales|analyse|analyze|clean|sql|chart/.test(t)) {
    steps.push({ agent: "Data Analyst Agent", purpose: "Analyze supplied data or define an analysis approach." });
  }
  if (/email|mail|reply|message|follow.?up|outreach|proposal/.test(t)) {
    steps.push({ agent: "Email Agent", purpose: "Prepare a professional communication draft." });
  }
  if (steps.length === 0) {
    steps.push({ agent: "Research Agent", purpose: "Understand the task and identify useful context." });
  }
  steps.push({ agent: "Report Agent", purpose: "Combine the work into an actionable final report." });
  return steps;
}

const prompts: Record<AgentName, string> = {
  "Research Agent": "You are the Research Agent. Analyze the user's request using your existing knowledge only. Do not claim to browse the live web or verify current facts. Clearly label assumptions and suggest sources the user should verify.",
  "Coding Agent": "You are the Coding Agent. Give accurate, maintainable code or implementation guidance. State assumptions, edge cases, and how to test. Never claim code was executed.",
  "Data Analyst Agent": "You are the Data Analyst Agent. Analyze only data actually supplied by the user. If no dataset is supplied, explain what data is needed and provide a safe analysis plan. Never invent metrics.",
  "Email Agent": "You are the Email Agent. Draft clear, professional communication. Do not send messages or imply that you sent them. Preserve the user's intent.",
  "Report Agent": "You are the Report Agent. Synthesize previous agent outputs into a concise, useful deliverable with headings, decisions, risks, and next actions. Distinguish facts from assumptions."
};

export function getPrompt(agent: AgentName) {
  return prompts[agent];
}
