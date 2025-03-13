# .windsurfrules

## Project Overview

*   **Type:** windsurf_file
*   **Description:** DevBizOps Powered by AI is a platform designed to empower technical startup founders by unifying deep technical operations (code repositories, CI/CD pipelines, etc.) with business-critical systems (CRMs, sales, investor metrics). It bridges the gap between technical excellence and business growth, ensuring that every line of code translates directly into measurable business outcomes.
*   **Primary Goal:** "Ensure that every line of code you write has a direct, measurable impact on your business outcomes," achieved by integrating real-time AI agents (e.g., TechTranslator Agent) that autonomously capture and translate technical and business data into actionable insights.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   [React Router 6]: Uses a client-side routing structure with a dedicated `src/routes/` directory that employs `createBrowserRouter` for route definitions.
    *   Example: "React Router 6" → `src/routes/` with route components mapping to specific paths (e.g., `/dashboard`, `/auth/login`).

### Core Directories

*   **Versioned Structure:**

    *   [src]: Contains all client-side code including components, pages, and route definitions.
    *   Example 1: `src/components` → Houses reusable UI components built with React and styled using Tailwind CSS.
    *   Example 2: `src/pages` → Contains page-level components that reflect high-level application views (e.g., landing page, unified dashboard, settings).

### Key Files

*   **Stack-Versioned Patterns:**

    *   [src/App.js]: Acts as the core entry point, setting up React Router and integrating global state management.
    *   Example 1: `src/App.js` → Configures the Browser Router and defines the route hierarchy.
    *   Example 2: `src/index.js` → Bootstraps the React application and includes integration with the Windsurf IDE for enhanced AI coding support.

## Tech Stack Rules

*   **Version Enforcement:**

    *   [node_js@latest & express_js@latest]: Use Express.js as the backend server framework to handle API routes and business logic.
    *   [react-router@6]: Strict adoption of React Router 6; all route configurations must reside under `src/routes` with no fallback to older routing methods.
    *   Example: "react-router@6" → Ensure that routing logic uses `createBrowserRouter` and related patterns without mixing legacy approaches.

## PRD Compliance

*   **Non-Negotiable:**

    *   "Every line of code you write has a direct, measurable impact on your business outcomes." This means AI agent functionalities, real-time data processing, and unified dashboards must be implemented such that technical changes immediately reflect in business metrics, ensuring investor-ready outputs.

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Example: "React Router 6 Auth Flow" → `src/routes/auth/Login.jsx` handles user authentication using JWT, directing authenticated users to a unified dashboard where real-time AI agents (e.g., TechTranslator Agent) actively update both technical and business views.
