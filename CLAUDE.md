# CLAUDE.md

# OpsFlow AI — Demo Frontend

## 1. Project Purpose

Build a small, clean, interactive web frontend for **OpsFlow AI**.

OpsFlow AI is an AI-powered operations support automation system.

The existing automation stack is:

- React frontend
- n8n workflow orchestration
- Ollama
- Qwen3:4b
- PostgreSQL
- Knowledge-base retrieval
- Human-in-the-loop processing

The purpose of this frontend is simple:

> Give a user a real interface where they can submit an operational request and see the result produced by the existing OpsFlow AI n8n workflow.

This is a **demo application**.

It is NOT a full enterprise service-management application.

---

# 2. Primary Objective

The completed demo should allow a user to:

1. Open the OpsFlow AI web page.
2. Describe an operational issue or request.
3. Submit the request.
4. Send the request to an n8n webhook.
5. Wait while n8n processes the request.
6. Receive the workflow result.
7. Display the result clearly and professionally.

The experience should feel like a small real internal operations tool.

Keep the scope intentionally small.

---

# 3. Scope Boundary

This frontend exists only to provide a user-facing interface for the existing automation.

Do NOT turn this project into another FlowOps application.

Do NOT build:

- Authentication
- Registration
- User accounts
- Roles
- Permissions
- Admin dashboard
- Ticket management
- Project management
- Task management
- Comments
- Chat
- Messaging
- Notification center
- Email integration
- Slack integration
- Microsoft Teams integration
- Analytics dashboard
- Reporting
- Search
- Filtering
- File uploads
- Attachments
- Knowledge-base management
- Vector database
- New RAG infrastructure
- Multi-agent architecture
- Autonomous actions
- Payment features
- Complex backend
- Microservices
- Docker/Kubernetes infrastructure
- Cloud deployment
- Paid AI APIs

Do not add features simply because they might be useful in a real enterprise product.

The goal is a focused demonstration.

---

# 4. Critical Architecture Rule

The existing n8n workflow is the source of truth for automation behavior.

React is NOT the automation engine.

React is only:

```text
User Interface
    ↓
Request Submission
    ↓
Display Workflow Result

n8n remains responsible for:

AI interpretation
Deterministic business rules
Routing
Priority
SLA
Confidence handling
Human review
Investigation
Knowledge retrieval
Knowledge ranking
Grounded response generation
Workflow orchestration

PostgreSQL remains responsible for persistence and audit data.

Ollama/Qwen remains responsible for local AI inference.

5. NEVER Duplicate Business Logic in React

Do not implement any of the following in JavaScript/TypeScript frontend code:

Classification rules
Category rules
Routing rules
Priority rules
SLA calculations
Confidence thresholds
Business-impact rules
Time-sensitive rules
Knowledge retrieval
Knowledge ranking
AI response generation
Human-review decision logic
Investigation decision logic

The frontend must display values returned by n8n.

For example:

WRONG:

if (confidence >= 0.95) {
  status = "Automatic";
}

RIGHT:

status = response.processing_mode;

The same principle applies to priority, routing, SLA, category, and all other workflow decisions.

6. Existing OpsFlow AI Behavior

The existing workflow already implements:

AI classification

Categories include:

Access
Hardware
Software
Network
Account
Facilities
Procurement
Business Process
Unknown
Affected department

Possible values include:

IT
Operations
Finance
HR
Procurement
Sales
Unknown
Confidence handling

Existing workflow thresholds:

>= 0.95
Automatic

0.85–0.949
Human Review

< 0.85
Investigation

These values belong to n8n.

React must not recreate them.

7. Existing Deterministic Decisions

Priority is calculated by n8n.

Existing priority values:

Critical
High
Normal

SLA is calculated by n8n.

React must display the returned SLA information.

Routing is calculated by n8n.

React must display the returned routing information.

Do not calculate any of these values in the frontend.

8. Knowledge-Assisted Responses

The existing n8n workflow can retrieve organizational knowledge and generate a grounded response.

Conceptually:

Request
    ↓
Search Knowledge Base
    ↓
Rank Knowledge Articles
    ↓
Select Best Knowledge Article
    ↓
Generate Grounded Response

The frontend does NOT perform this process.

The frontend only displays the result returned by n8n.

If a knowledge article is available, the UI may display:

Knowledge article title
Generated response
Knowledge status
Response status

If no knowledge article exists, the UI must not invent guidance.

9. Important n8n Integration Boundary

The frontend communicates with n8n through an HTTP webhook.

Conceptually:

React
  ↓
HTTP POST
  ↓
n8n Webhook
  ↓
Existing OpsFlow AI workflow
  ↓
Structured result
  ↓
React

The frontend should not communicate directly with:

PostgreSQL
Ollama
pgAdmin
n8n internal APIs
Knowledge Base tables

The browser should only communicate with the intended n8n webhook.

10. Do Not Assume the Final n8n Response Contract

The existing n8n workflow has been tested through individual nodes.

Before implementing frontend response rendering:

Inspect the actual webhook response.
Identify the fields actually returned.
Use those fields as the frontend contract.
Do not invent missing fields.
Do not silently transform business decisions.

If the existing workflow needs a small response-formatting/adapter step so the webhook can return one clean JSON response, that change belongs in n8n and must remain limited to response formatting/integration.

Do not move workflow logic into React to compensate for a missing field.

11. Request Contract

The intended frontend request is minimal.

Conceptually:

{
  "request_text": "I cannot connect to the company VPN."
}

Do not send unnecessary frontend-generated business data.

The frontend should NOT generate:

request_id
classification_id
automation_run_id
category
confidence
priority
SLA
routing department
business impact
time sensitivity

Those belong to the backend workflow.

12. Frontend Pages

Use a single primary page.

The application should not have multiple modules.

The primary screen should contain:

OpsFlow AI

AI-Powered Operations Support

How can we help?

[ Request description textarea ]

[ Submit Request ]

After processing, show the result on the same page.

A separate complex routing system is unnecessary.

13. Visual Design

The visual design should be:

Clean
Simple
Modern
Professional
Calm
Minimal

Preferred visual direction:

White or very light background
Dark text
Blue-green / teal accent
Subtle borders
Moderate corner radius
Generous whitespace
Minimal shadows
Clear typography
Strong hierarchy

Avoid:

Excessive gradients
Glassmorphism
Neon colors
Excessive animations
Sci-fi styling
Gaming aesthetics
Cryptocurrency/dashboard aesthetics
Large decorative illustrations
Excessive cards
Visual clutter

The application should resemble a lightweight internal business tool.

14. Main User Experience
Header

Display:

OpsFlow AI
AI-Powered Operations Support

Optional supporting text:

Describe an operational issue or request and OpsFlow AI will analyze and route it.

Keep the header compact.

15. Request Form

Primary heading:

How can we help?

Textarea:

Describe your issue or request...

Example placeholder:

Example: I cannot connect to the company VPN.

Primary button:

Submit Request

The textarea should be the main focus of the page.

16. Form Validation

Do not allow an empty request to be submitted.

If the request is empty, show a simple message:

Please describe your request before submitting.

Do not add complex validation rules.

Do not attempt to classify the request locally.

17. Loading State

After submission:

Disable the submit button.
Prevent duplicate submissions.
Show a clear loading state.
Keep the user informed that the request is being processed.

Example:

Analyzing request...

Do not display:

Ollama internals
model token counts
n8n node names
PostgreSQL operations
internal workflow IDs
execution IDs
18. Result Presentation

The result should be easy for a normal user to understand.

Depending on the actual webhook response, display relevant information such as:

Request Status

Human Review Required

Category
Network

Routing
IT

Priority
Normal

SLA
48 hours

Knowledge
VPN Troubleshooting Guide

Recommended Guidance

First, verify your device has an active
internet connection...

Only display information actually returned by n8n.

Do not fabricate values.

19. Processing Mode Presentation

Translate technical processing modes into simple user-facing labels.

If the backend returns:

Automatic

display:

Automatically Processed

If it returns:

Human Review

display:

Human Review Required

If it returns:

Investigation

display:

Investigation Required

This is presentation only.

Do not change the underlying backend value.

20. Investigation State

When n8n indicates that investigation is required, make this clear.

Example:

Investigation Required

We could not determine the request with sufficient
confidence. The request requires further investigation.

Do not generate additional troubleshooting advice.

Do not ask the frontend AI to explain the request.

Do not attempt to override the n8n decision.

21. Human Review State

When n8n indicates:

Human Review

show something like:

Human Review Required

Your request has been analyzed and routed for
human review.

If available, display:

Category
Routing department
Priority
SLA
Knowledge-assisted guidance

Do not claim that the request has been resolved.

Do not claim that a human has already reviewed it unless the backend explicitly says so.

22. Knowledge Article State

If the response contains a knowledge article:

Display:

Knowledge Guidance

VPN Troubleshooting Guide

[generated response]

Keep the response readable.

Do not expose the LLM prompt.

Do not expose model internals.

Do not expose raw JSON unless specifically requested for development/debugging.

23. No Knowledge Article

If the workflow indicates that no knowledge article was found:

Display something similar to:

No Knowledge Article Available

There is currently no matching organizational
knowledge article for this request.

Further handling is required.

Do NOT generate a replacement answer in React.

Do NOT call another AI service.

Do NOT make up instructions.

This is an intentional safety behavior of OpsFlow AI.

24. Error Handling

Handle only the basic errors needed for the demo.

Empty request
Please describe your request before submitting.
Network/webhook failure
Unable to reach OpsFlow AI.

Please try again.
Unexpected response
OpsFlow AI returned an unexpected response.
Server-side processing failure
Something went wrong while processing your request.
Please try again.

Do not expose:

stack traces
SQL errors
internal URLs
API keys
Ollama errors
n8n execution details
internal file paths

Detailed errors may be logged during development, but should not be displayed to the user.

25. Frontend State Model

Keep frontend state minimal.

The application only needs to manage concepts such as:

request text
loading
result
error

Do not introduce complex global state management unless the existing project already requires it.

Do not add Redux, Zustand, or another state-management library for this demo unless there is an actual demonstrated need.

Simple local React state is preferred.

26. Technology

Preferred stack:

React
Vite
TypeScript or JavaScript
CSS / Tailwind CSS

If the existing project already has a stack, inspect it first and reuse it.

Do not migrate frameworks.

Do not introduce a new framework merely for styling.

Avoid unnecessary dependencies.

27. Environment Configuration

The n8n webhook URL must be configurable.

Preferred variable:

VITE_N8N_WEBHOOK_URL

Example:

VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/opsflow-ai

Do not hardcode the webhook URL throughout the codebase.

Do not commit secrets.

Do not create fake production credentials.

If the real webhook URL is not yet known, use a documented placeholder.

28. CORS / Browser Integration

The frontend runs in a browser and may be served from a different local origin than n8n.

Treat browser-to-n8n connectivity as an integration concern.

If the browser cannot call the webhook because of CORS or browser security restrictions:

Identify the actual problem.
Make the smallest appropriate integration change.
Do not introduce a proxy server or backend application merely to hide a simple configuration issue.
Do not bypass browser security.
Do not expose credentials in frontend code.

The objective remains:

React → n8n Webhook

with the smallest reasonable amount of infrastructure.

29. Project Structure

Keep the project structure small.

A reasonable structure is:

src/
├── components/
│   ├── RequestForm
│   ├── RequestResult
│   └── StatusBadge
├── services/
│   └── n8nClient
├── types/
│   └── opsflow
├── App
└── main

This is guidance, not a requirement.

If the existing project has a better simple structure, keep it.

Do not create dozens of files for a small application.

30. API Client Separation

Keep the n8n HTTP request in a small service/module rather than scattering fetch logic throughout components.

For example:

services/n8nClient

The service should:

Read the webhook URL from environment configuration.
Send the request.
Parse the response.
Return the response to the UI.
Surface errors cleanly.

It must not contain business rules.

31. Type Safety

If TypeScript is used, define lightweight types for:

Request payload
Workflow response
Relevant status values

Do not type fields that have not been verified from the actual webhook response.

If the n8n response contract changes, update the types accordingly.

Do not use any everywhere simply to avoid defining the actual response shape.

32. Accessibility

The demo should have basic accessibility:

Proper form labels
Keyboard-accessible controls
Visible focus states
Sufficient text contrast
Button disabled state during submission
Clear error messages
Semantic HTML where practical

Do not over-engineer accessibility tooling for this small demo.

33. Responsive Behavior

Desktop is the primary target.

The interface should also remain usable on:

Laptop
Tablet
Mobile

Do not spend excessive development time on complex responsive layouts.

A simple responsive single-column layout is sufficient.

34. Animations

Animations should be minimal.

Acceptable:

Button loading indicator
Small result appearance transition
Subtle status transition

Avoid:

Page-wide animations
Parallax
Animated backgrounds
Decorative motion
Excessive transitions

The application should feel fast and professional.

35. Demo Scenarios

The frontend should make it easy to demonstrate the existing OpsFlow AI behavior.

Known demonstration requests include:

VPN
I cannot connect to the company VPN.

Expected workflow behavior includes:

Network
IT
Human Review
VPN Troubleshooting Guide
Critical warehouse incident
The warehouse network is down and today's outbound orders cannot be processed.

Expected workflow behavior includes:

Network
Operations
IT
Critical
1-hour SLA
Automatic
Warehouse Network Outage Procedure
Time-sensitive laptop issue
I need my laptop for today's client presentation and it won't turn on.

Expected workflow behavior includes:

Hardware
IT
High
4-hour SLA
Human Review
Laptop Power Troubleshooting
Ambiguous request
Something is wrong.

Expected workflow behavior includes:

Unknown
Investigation
Blocked
No confident classification
No knowledge article
I need to request a new vendor payment approval.

Expected knowledge behavior:

No matching knowledge article
↓
No generated knowledge response

These are demonstration examples only.

Do not hardcode these requests into the application as business logic.

36. Development Workflow

Claude Code MUST work incrementally.

Do not implement the entire application in one large change.

Use this sequence:

Phase 1 — Inspect

Before modifying files:

Inspect the repository.
Inspect the existing package configuration.
Inspect the current React/Vite structure.
Identify existing styling conventions.
Identify whether TypeScript or JavaScript is used.
Identify the current build command.
Identify any existing components worth reusing.

Then report the findings and proposed minimal implementation plan.

Do not modify files during this inspection phase unless explicitly requested.

Phase 2 — Minimal UI

Implement:

Header
Request textarea
Submit button
Basic styling

Verify the application builds.

Phase 3 — n8n Integration

Implement:

Webhook URL configuration
Request payload
HTTP submission
Loading state
Error handling

Use the actual n8n webhook contract.

Do not invent backend behavior.

Phase 4 — Result UI

Implement:

Processing status
Category
Routing
Priority
SLA
Knowledge article
Grounded response

Only display fields actually available from the webhook response.

Phase 5 — Polish

Improve:

spacing
typography
visual hierarchy
responsive behavior
loading state
error state
status presentation

Do not add new functionality during this phase.

Phase 6 — Verification

Run:

Development server.
Production build.
Basic frontend validation.
Successful webhook request.
Error case.
Empty-request case.
At least one Automatic workflow result.
At least one Human Review result.
At least one Investigation result.
At least one No-Knowledge result.

Fix actual problems before declaring the frontend complete.

37. Change Control

Before making a significant change:

Ask:

Does this change directly improve the simple user-facing demonstration of OpsFlow AI?

If no, do not make the change.

Avoid:

speculative refactoring
architecture expansion
unnecessary abstractions
unnecessary libraries
feature creep
backend duplication

Prefer the smallest change that solves the actual problem.

38. Do Not Modify n8n Unless Required for Integration

The n8n workflow has already been tested and deliberately frozen.

Do not:

rewrite the classification prompt
modify confidence thresholds
change routing rules
change priority rules
change SLA rules
change knowledge retrieval logic
change ranking logic
change AI response-generation behavior
restructure the workflow

A small n8n integration/response adapter may be added if necessary to expose a clean webhook interface.

Such an adapter must not alter the underlying business logic.

39. Do Not Modify PostgreSQL Unless Required

The frontend should not access PostgreSQL directly.

Do not add database tables for frontend-only concerns.

Do not add a frontend-specific backend database.

The existing PostgreSQL data remains owned by the n8n/backend workflow.

40. No Fake Data in the Real Integration

During development, mock data may be used temporarily to build the UI if the webhook is not ready.

However:

clearly isolate mock data
do not mix mock data with real workflow logic
remove or disable mock behavior when real integration is available
do not present mock results as real workflow results

The final demo should use the actual n8n workflow.

41. Security

Never put secrets in frontend source code.

Never expose:

PostgreSQL credentials
Ollama credentials if any exist
private API keys
database connection strings
internal credentials

The frontend only needs the n8n webhook endpoint.

If the webhook itself requires authentication, follow the actual integration requirements without exposing secrets unnecessarily in client-side code.

Do not invent an authentication system for the demo.

42. Performance

Keep the frontend lightweight.

Do not add:

large component libraries
unnecessary packages
complex state management
heavy animations
large assets

The page should load quickly and remain simple.

43. Code Quality

Prefer:

clear names
small components
simple functions
readable code
minimal abstraction
consistent formatting
useful error handling

Avoid:

giant components
deeply nested conditionals
duplicated fetch logic
unnecessary custom frameworks
clever abstractions that make the demo harder to understand

The code should be understandable to another developer reviewing the portfolio project.

44. Completion Criteria

The frontend is complete when:

User interaction
User can enter a request.
User can submit it.
Empty requests are rejected.
Duplicate submission is prevented while processing.
Integration
Request reaches the n8n webhook.
Actual workflow response is received.
Errors are handled gracefully.
Result

The user can clearly understand:

What happened to their request.
Its category, when available.
Where it was routed, when available.
Its priority, when available.
Its SLA, when available.
Whether human review is required.
Whether investigation is required.
Whether knowledge guidance was available.
The generated grounded response, when available.
Safety
No business logic is duplicated in React.
No knowledge response is fabricated.
No frontend AI is introduced.
No direct database access exists.
Quality
Application builds successfully.
Application works locally.
UI is clean and responsive.
No unnecessary features were added.
45. Final Product Principle

The finished application should communicate this idea clearly:

A user has an operational problem.
            ↓
They describe it.
            ↓
OpsFlow AI analyzes it.
            ↓
n8n orchestrates the workflow.
            ↓
Deterministic rules control decisions.
            ↓
Organizational knowledge provides guidance.
            ↓
Human review handles uncertainty.
            ↓
The user receives a clear result.

The frontend exists to make this workflow:

visible, interactive, understandable, and demonstrable.

Do not optimize for feature count.

Optimize for:

Simple
   ↓
Clean
   ↓
Reliable
   ↓
Interactive
   ↓
Easy to demonstrate

The project is intentionally small.


### One other change I'd make to our Claude Code process

I **would not immediately ask Claude Code to build anything**.

Start with this:

> **Read `CLAUDE.md` and inspect the existing repository. Do not modify any files yet. Identify the current React/Vite structure, package manager, styling approach, entry points, and build commands. Then propose the smallest implementation plan for connecting the frontend to the existing OpsFlow AI n8n webhook. Do not implement until I approve the plan.**

That gives us a controlled start.

And one important architectural point: **we should first establish the actual n8n webhook response contract before Claude builds the result UI.** Your current workflow has the core processing and knowledge branches validated, but the frontend ultimately needs one clean response to consume. We shouldn't have Claude invent that contract.