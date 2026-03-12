# AGENTS.md
HealthAI App — AI Agent Operating Guide
For Antigravity IDE / Gemini Coding Agents

This file defines how coding agents should work inside this repository.
Agents must read this file before performing any action.

------------------------------------------------------------

# PROJECT OVERVIEW

Project: HealthAI App

Goal:
Build a scalable AI-powered health platform using a modern web stack with a clean architecture, secure backend, and efficient frontend.

Architecture:

Frontend
- Vite-based frontend
- Code located in `/src`
- Static assets in `/public`

Backend
- Node.js backend
- Located in `/backend`

Infrastructure
- Docker support (`docker-compose.yml`)
- Deployment configuration (`vercel.json`)
- Environment configuration via `.env`

------------------------------------------------------------

# GLOBAL DEVELOPMENT PRINCIPLES

Agents must always follow these principles:

1. Prefer simple and maintainable solutions
2. Avoid unnecessary dependencies
3. Never break existing functionality
4. Write modular and reusable code
5. Avoid duplication
6. Always keep performance and security in mind

------------------------------------------------------------

# AGENT WORKFLOW (MANDATORY)

Before modifying any code the agent must follow this workflow.

1. Understand the user request.
2. Scan the repository to identify relevant files.
3. Propose a short plan before writing code.
4. Implement minimal and clean changes.
5. Verify functionality and code integrity.

Agents must NEVER edit large parts of the project without explaining why.

------------------------------------------------------------

# PLANNING RULES

Before writing code:

- Always propose a plan first.
- Plans should contain 3–5 steps.
- Mention which files will be edited.
- Mention possible risks.

Example plan:

1. Locate authentication middleware
2. Add input validation
3. Update API route
4. Test endpoint

------------------------------------------------------------

# CODE STYLE RULES

General coding rules:

- Follow ESLint configuration (`eslint.config.js`)
- Prefer small functions
- Avoid deeply nested logic
- Use clear naming conventions

Naming:

Variables → camelCase  
Functions → camelCase  
Classes → PascalCase  
Constants → UPPER_SNAKE_CASE  

File names → kebab-case or camelCase.

------------------------------------------------------------

# FRONTEND DEVELOPMENT RULES

Frontend code is located in:

/src

Recommended structure:

src
components
pages
services
hooks
utils

Rules:

- Components must be reusable
- Avoid large components
- Separate UI and logic
- Use modular styles
- Prefer composition over inheritance

Agents should avoid creating unnecessary folders.

------------------------------------------------------------

# BACKEND DEVELOPMENT RULES

Backend code is located in:

/backend

Recommended architecture:

backend
controllers
services
routes
middlewares
utils

Rules:

Controllers
- Handle request and response only

Services
- Contain business logic

Routes
- Connect endpoints to controllers

Never mix business logic inside route files.

------------------------------------------------------------

# SECURITY RULES

Agents must enforce strong security practices.

Never expose:

- API keys
- authentication tokens
- secrets
- environment variables

Sensitive values must always come from `.env`.

All user inputs must be validated.

Never log sensitive information.

------------------------------------------------------------

# ENVIRONMENT VARIABLES

All environment variables must be listed in:

.env.example

Example:

PORT=
OPENAI_API_KEY=
DATABASE_URL=

If a new variable is introduced, `.env.example` must be updated.

------------------------------------------------------------

# ERROR HANDLING

Backend must never crash due to unhandled errors.

Use structured error responses.

Example format:

{
  "success": false,
  "error": "Error description"
}

Agents should implement centralized error handling when possible.

------------------------------------------------------------

# PERFORMANCE GUIDELINES

Agents should optimize for:

- minimal bundle size
- efficient algorithms
- reduced API calls
- non-blocking backend operations

Avoid expensive synchronous operations.

------------------------------------------------------------

# TESTING EXPECTATIONS

When implementing features:

- Write testable code
- Avoid tightly coupled logic
- Ensure deterministic functions

Agents should suggest tests when missing.

------------------------------------------------------------

# DOCKER RULES

Docker configuration exists in:

docker-compose.yml

Agents must:

- Keep container configuration minimal
- Avoid unnecessary image layers
- Ensure containers start correctly

------------------------------------------------------------

# DEPLOYMENT RULES

Deployment configuration exists in:

vercel.json

Agents must ensure:

- Production builds succeed
- Environment variables are respected
- No debug logs remain in production builds

------------------------------------------------------------

# FILE MODIFICATION RULES

Agents should:

Prefer modifying existing files rather than creating duplicates.

Avoid unnecessary new files.

Do not rename major directories unless necessary.

------------------------------------------------------------

# DOCUMENTATION RULES

Documentation must be updated when:

- new features are added
- environment variables change
- architecture changes

Documentation locations:

README.md  
/docs

------------------------------------------------------------

# UI RECREATION WORKFLOW (SCREENSHOT METHOD)

When the user provides a reference screenshot for UI recreation:

1. Generate a single `index.html` file if requested.
2. Use Tailwind CSS via CDN when appropriate.
3. Inline all required content unless the user requests multiple files.

Example Tailwind CDN:

<script src="https://cdn.tailwindcss.com"></script>

------------------------------------------------------------

# VISUAL VERIFICATION WORKFLOW

After generating UI code:

1. Render the page locally.
2. Capture a screenshot using Puppeteer.

Example:

npx puppeteer screenshot index.html --fullpage

3. Compare screenshot with reference image.

Check for mismatches in:

- spacing and padding
- font sizes and weights
- colors (exact hex)
- alignment
- border radius
- shadows and effects
- responsive behavior
- image/icon placement

------------------------------------------------------------

# ITERATION RULE

If mismatches exist:

1. Fix HTML/CSS.
2. Re-render.
3. Re-screenshot.
4. Compare again.

Repeat until the UI visually matches the reference within ~2–3px.

Agents must perform at least two comparison passes.

------------------------------------------------------------

# WHEN AGENT IS UNCERTAIN

If the agent is unsure about a change:

1. Ask the user for clarification
2. Suggest multiple approaches
3. Do not guess blindly

------------------------------------------------------------

# PRIORITY ORDER

Agents must prioritize:

1. Stability
2. Security
3. Clean architecture
4. Performance
5. Maintainability

------------------------------------------------------------

# FINAL CHECKLIST

Before finishing a task the agent must verify:

- Code compiles
- No obvious bugs introduced
- ESLint rules respected
- Environment variables handled correctly
- Project structure maintained
- Documentation updated if needed

------------------------------------------------------------

END OF AGENT INSTRUCTIONS