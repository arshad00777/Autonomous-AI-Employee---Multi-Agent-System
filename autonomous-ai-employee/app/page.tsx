 "use client";

import { useEffect, useState } from "react";
import {
  Activity, ArrowRight, Bot, BrainCircuit, CheckCircle2, Code2, Database,
  FileText, Mail, Menu, Plus, Search, Send, ShieldCheck, Sparkles,
  Terminal, Users, Workflow, Zap
} from "lucide-react";

type Output = { agent: string; purpose: string; output: string };
type Result = { plan: { agent: string; purpose: string }[]; outputs: Output[]; demoMode: boolean };

const agentMeta = [
  { name: "Research Agent", desc: "Structures research briefs and key questions", icon: Search, color: "violet" },
  { name: "Coding Agent", desc: "Plans code, debugging and implementation", icon: Code2, color: "blue" },
  { name: "Data Analyst Agent", desc: "Works with supplied data and analysis plans", icon: Database, color: "cyan" },
  { name: "Email Agent", desc: "Creates professional email and outreach drafts", icon: Mail, color: "orange" },
  { name: "Report Agent", desc: "Combines work into a clear final deliverable", icon: FileText, color: "green" }
];

const examples = [
  "Research the market opportunity for an AI customer support product for small businesses.",
  "Build a secure REST API in Python FastAPI with user registration and login.",
  "Analyze this sales data, identify trends and recommend next steps.",
  "Draft a professional follow-up email after a software engineering interview."
];

export default function Home() {
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("workspace");
  const [history, setHistory] = useState<{ task: string; time: string }[]>([]);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem("aai-history") || "[]")); } catch {}
  }, []);

  async function runTask() {
    setError("");
    setResult(null);
    if (task.trim().length < 5) {
      setError("Please describe a task using at least 5 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, context })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The task could not be completed.");
      setResult(data);
      const next = [{ task, time: new Date().toLocaleString() }, ...history].slice(0, 8);
      setHistory(next);
      localStorage.setItem("aai-history", JSON.stringify(next));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={22} /></div>
          <div><strong>workforce<span>.ai</span></strong><small>AI OPERATIONS</small></div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <button className={`nav-item ${activeTab === "workspace" ? "selected" : ""}`} onClick={() => setActiveTab("workspace")}><Workflow size={18}/> Agent workspace</button>
        <button className={`nav-item ${activeTab === "agents" ? "selected" : ""}`} onClick={() => setActiveTab("agents")}><Bot size={18}/> AI agents <span className="nav-count">5</span></button>
        <button className={`nav-item ${activeTab === "activity" ? "selected" : ""}`} onClick={() => setActiveTab("activity")}><Activity size={18}/> Activity</button>
        <div className="sidebar-bottom">
          <div className="secure-card"><ShieldCheck size={18}/><div><b>Human-in-the-loop</b><p>Review outputs before taking action.</p></div></div>
          <div className="profile"><div className="avatar">A</div><div><b>Admin workspace</b><small>Personal plan</small></div><Menu size={17}/></div>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div className="crumb">Workspace <span>/</span> <b>{activeTab === "workspace" ? "Agent workspace" : activeTab === "agents" ? "AI agents" : "Activity"}</b></div>
          <div className="top-actions"><span className="status-dot"></span><span>System operational</span><div className="top-avatar">A</div></div>
        </header>

        {activeTab === "agents" ? (
          <div className="content">
            <div className="eyebrow"><Sparkles size={14}/> YOUR DIGITAL TEAM</div>
            <h1>Meet your AI workforce.</h1>
            <p className="subhead">Specialized agents collaborate to move work forward.</p>
            <div className="agent-grid">
              {agentMeta.map((a) => { const Icon = a.icon; return <div className="agent-card" key={a.name}><div className={`agent-icon ${a.color}`}><Icon size={21}/></div><h3>{a.name}</h3><p>{a.desc}</p><span className="agent-state"><i/> Ready to run</span></div>; })}
            </div>
          </div>
        ) : activeTab === "activity" ? (
          <div className="content">
            <div className="eyebrow"><Activity size={14}/> WORK LOG</div><h1>Recent activity.</h1><p className="subhead">Your recent tasks are saved in this browser.</p>
            <div className="history-panel">{history.length ? history.map((h, i) => <div className="history-row" key={i}><div className="history-icon"><CheckCircle2 size={18}/></div><div><b>{h.task}</b><small>{h.time}</small></div></div>) : <div className="empty">No tasks yet. Run your first task from Agent workspace.</div>}</div>
          </div>
        ) : (
          <div className="content">
            <div className="eyebrow"><Zap size={14}/> MULTI-AGENT AUTOMATION</div>
            <div className="hero-row"><div><h1>Get work done.<br/><span>With a team of AI agents.</span></h1><p className="subhead">Describe an outcome. Your AI workforce plans the steps, delegates the work, and brings everything together.</p></div><div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="hero-core"><BrainCircuit size={42}/></div><div className="orbit-node node-a"><Search size={16}/></div><div className="orbit-node node-b"><Code2 size={16}/></div><div className="orbit-node node-c"><Database size={16}/></div><div className="orbit-node node-d"><FileText size={16}/></div></div></div>

            <div className="stats">
              <div><span>AVAILABLE AGENTS</span><b>05</b><small>Specialized roles</small></div>
              <div><span>ORCHESTRATION</span><b>Active</b><small>Sequential workflow</small></div>
              <div><span>APPROVAL MODE</span><b>Human-led</b><small>No actions sent automatically</small></div>
            </div>

            <div className="work-grid">
              <section className="task-panel">
                <div className="panel-heading"><div><span className="step">01</span><div><h2>What should we work on?</h2><p>Give your AI team a clear objective.</p></div></div><span className="live-label"><i/> READY</span></div>
                <label htmlFor="task">TASK DESCRIPTION</label>
                <textarea id="task" value={task} onChange={e => setTask(e.target.value)} placeholder="Example: Research competitors, identify product gaps, and prepare a launch plan..." rows={5}/>
                <label htmlFor="context">OPTIONAL CONTEXT OR DATA</label>
                <textarea id="context" className="context-input" value={context} onChange={e => setContext(e.target.value)} placeholder="Paste notes, requirements, sample data, code, or background information..." rows={3}/>
                <div className="suggestions"><span>TRY AN EXAMPLE</span>{examples.map((x, i) => <button key={i} onClick={() => setTask(x)}>{x}</button>)}</div>
                {error && <div className="error">{error}</div>}
                <button className="run-button" onClick={runTask} disabled={busy}>{busy ? <><span className="spinner"/> Agents are working...</> : <><Sparkles size={17}/> Run AI workforce <ArrowRight size={17}/></>}</button>
                <p className="disclaimer"><ShieldCheck size={13}/> AI outputs can be incorrect. Review all results before using them.</p>
              </section>

              <aside className="team-panel">
                <div className="team-heading"><div><span className="step">02</span><div><h2>Your AI team</h2><p>Agents selected for your task</p></div></div><span className="team-total">5 AGENTS</span></div>
                <div className="team-list">{agentMeta.map((a) => {const Icon = a.icon; return <div className="team-member" key={a.name}><div className={`mini-icon ${a.color}`}><Icon size={17}/></div><div><b>{a.name}</b><small>{a.desc}</small></div><span className="ready-check"><CheckCircle2 size={15}/></span></div>;})}</div>
                <div className="workflow-note"><Workflow size={18}/><div><b>Manager-led workflow</b><p>The task router selects relevant agents and the Report Agent combines their notes.</p></div></div>
              </aside>
            </div>

            {busy && <div className="progress-panel"><div className="progress-top"><b><span className="pulse"></span> Workflow in progress</b><span>Agents are processing your task</span></div><div className="progress-track"><i/></div></div>}
            {result && <section className="results-panel"><div className="results-title"><div><div className="eyebrow"><CheckCircle2 size={14}/> WORKFLOW COMPLETE</div><h2>Your team's deliverables</h2></div><span className={result.demoMode ? "demo-tag" : "success-tag"}>{result.demoMode ? "DEMO MODE" : "AI GENERATED"}</span></div>{result.demoMode && <div className="notice">Demo mode is active. Add an API key to generate real AI responses.</div>}<div className="plan-line"><b>Execution plan</b>{result.plan.map((p, i) => <span key={p.agent}><i>{i + 1}</i>{p.agent}</span>)}</div>{result.outputs.map((o, i) => <details className="output-card" key={o.agent} open={i === result.outputs.length - 1}><summary><div><span className="output-number">0{i + 1}</span><b>{o.agent}</b><small>{o.purpose}</small></div><ArrowRight size={16}/></summary><pre>{o.output}</pre></details>)}</section>}
          </div>
        )}
        <footer><span>© 2026 workforce.ai</span><span>Built for responsible AI-assisted work <span className="footer-dot">•</span> v1.0.0</span></footer>
      </section>
    </main>
  );
}
