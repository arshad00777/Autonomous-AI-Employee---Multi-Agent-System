import { NextRequest, NextResponse } from "next/server";
import { chooseAgents, getPrompt, AgentName } from "@/lib/agents";

export const runtime = "nodejs";
export const maxDuration = 60;

type Message = { role: "system" | "user" | "assistant"; content: string };

async function askModel(messages: Message[]) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.35,
      messages
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`AI provider error (${response.status}): ${details.slice(0, 500)}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content as string | undefined;
}

function demoOutput(agent: AgentName, task: string) {
  return [
    `## ${agent} — demo mode`,
    "No AI API key is configured, so this is a workflow preview rather than an AI-generated answer.",
    `**Task received:** ${task}`,
    "**Next step:** Add OPENAI_API_KEY to `.env.local` and restart the development server to enable real model responses."
  ].join("\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = typeof body.task === "string" ? body.task.trim() : "";
    const context = typeof body.context === "string" ? body.context.trim() : "";

    if (!task || task.length < 5) {
      return NextResponse.json({ error: "Please enter a task with at least 5 characters." }, { status: 400 });
    }
    if (task.length > 12000 || context.length > 20000) {
      return NextResponse.json({ error: "Task or context is too long. Please shorten it." }, { status: 400 });
    }

    const plan = chooseAgents(task);
    const outputs: { agent: AgentName; purpose: string; output: string }[] = [];
    let previous = "";

    for (const step of plan) {
      const messages: Message[] = [
        { role: "system", content: getPrompt(step.agent) },
        {
          role: "user",
          content: [
            `Task: ${task}`,
            context ? `User-provided context/data:\n${context}` : "No additional context supplied.",
            previous ? `Previous agent notes:\n${previous}` : "",
            `Your assignment: ${step.purpose}`,
            "Be transparent about limitations. Do not invent actions, external research, data, or results."
          ].filter(Boolean).join("\n\n")
        }
      ];

      const output = await askModel(messages);
      const finalOutput = output || demoOutput(step.agent, task);
      outputs.push({ agent: step.agent, purpose: step.purpose, output: finalOutput });
      previous += `\n\n### ${step.agent}\n${finalOutput}`;
    }

    return NextResponse.json({
      plan,
      outputs,
      final: outputs[outputs.length - 1]?.output || "No output generated.",
      demoMode: !process.env.OPENAI_API_KEY
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
