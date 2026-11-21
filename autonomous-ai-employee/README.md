# Autonomous AI Employee — Multi-Agent Workspace

A Next.js application that routes a user's task to specialized AI roles and combines their outputs into a final report.

## Features

- Manager-style task router selects relevant agents.
- Research, Coding, Data Analyst, Email and Report agents.
- Sequential agent execution: later agents receive earlier notes.
- Optional user-provided context/data.
- Browser-local recent activity history.
- Demo mode works without an API key.
- OpenAI-compatible Chat Completions integration.
- Responsive dashboard; deployable to Vercel.

## Requirements

- Node.js 18.17+ (Node.js 20 LTS recommended)
- npm
- An OpenAI API key for live AI responses (optional for demo mode)

## Run in VS Code

1. Extract the ZIP file.
2. Open the extracted `autonomous-ai-employee` folder in VS Code.
3. Open Terminal → New Terminal.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Copy `.env.example` to `.env.local`.
6. Add your API key in `.env.local`:

   ```env
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

   Keep the key private. Never put it in `app/page.tsx`, commit it to GitHub, or use a `NEXT_PUBLIC_` prefix.

7. Start the app:

   ```bash
   npm run dev
   ```

8. Open http://localhost:3000

Without an API key, the dashboard runs in demo mode and shows setup guidance. With a valid key, the API route calls the configured model.

## Deploy to Vercel

1. Create a GitHub repository and upload the extracted project files.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import your GitHub repository.
4. Framework preset should be detected as **Next.js**.
5. In **Project Settings → Environment Variables**, add:
   - `OPENAI_API_KEY` = your private API key
   - `OPENAI_MODEL` = `gpt-4o-mini` (optional; this is the default)
6. Deploy. If you change environment variables later, redeploy the project.
7. Open the Vercel deployment URL and test a task.

You can also deploy from the VS Code terminal using the Vercel CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

Vercel will prompt you to link the project and configure deployment.

## How the workflow works

1. The API validates the task and optional context.
2. `lib/agents.ts` selects relevant specialist agents using task keywords.
3. The selected agents run sequentially through the model API.
4. Each agent's output is passed to the next agent.
5. The Report Agent creates the final consolidated deliverable.
6. The UI displays the plan and each agent's output.

## Important limitations and production hardening

This is a complete runnable starter/MVP, not an unrestricted autonomous employee. The Research Agent uses model knowledge and does **not** browse the live web. The Email Agent drafts messages but does not send email. The Data Analyst Agent only analyzes data or text you supply; it does not execute arbitrary uploaded files or connect to databases. No real-world action is taken automatically.

Before using with customers, add authentication, rate limiting, usage/cost controls, persistent database storage, audit logs, stronger input/output validation, and explicit approval flows for any external actions. Treat model output as untrusted and review it before acting on it.

## Project structure

```text
autonomous-ai-employee/
├── app/
│   ├── api/run/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/agents.ts
├── public/
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Troubleshooting

- `npm` is not recognized: install Node.js LTS and reopen VS Code.
- API provider error: check the key, account billing/limits, model access and environment variable spelling.
- Changes to `.env.local` require restarting `npm run dev`.
- Vercel environment variable changes require a new deployment.
