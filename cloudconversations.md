# Claude Code Memory: DevBizOps Project

This file serves as a memory for Claude Code to store important information about the DevBizOps project structure, architecture, and decisions made during development. Information here helps Claude provide more consistent and helpful assistance across sessions.

## Project Architecture

DevBizOps is a React frontend application that uses Supabase for backend services (authentication, database). The application is deployed on Vercel.

### Key Components

- **Frontend**: React with React Router v6
- **Authentication**: Supabase Auth
- **Database**: Supabase Database 
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Environment Variables

The application expects these environment variables:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: On Vercel, these are stored with different names:
```
SUPABASE_URL
SUPABASE_ANON_KEY
```

During build, these are mapped to the REACT_APP_* format in vercel.json.

## Common Commands

### Deployment

Vercel automatically deploys when changes are pushed to the main branch.

### Development

```bash
cd frontend
npm start  # Start the development server
npm run build  # Create a production build
```

## Troubleshooting Knowledge

### March 2025: Deployment Issues

On March 14-15, 2025, we fixed several issues with the application deployment:

1. **Router Configuration Issues**
   - Problem: Multiple Router components nested, causing React Router errors
   - Fix: Restructured App.js to use Outlet instead of Router, using a single RouterProvider

2. **Supabase Integration Issues**
   - Problem: Circular dependencies between supabaseClient.js and supabaseCredentials.js
   - Fix: Simplified Supabase client creation to a single file exporting a consistent client

3. **Environment Variable Issues**
   - Problem: Vercel environment variables not properly passed to React application
   - Fix: Added variable mapping in vercel.json build command

4. **Authentication Flow Issues**
   - Problem: Application was trying to use non-existent backend API endpoints for auth
   - Fix: Modified authService.js to use Supabase client SDK directly for authentication

5. **Build Output Issues**
   - Problem: Incorrect paths in vercel.json for the build output directory
   - Fix: Corrected the outputDirectory setting and destination paths in vercel.json

### Rate Limiting

Supabase has rate limits, especially on free tier:
- Added graceful handling for 429 Too Many Requests responses
- If hitting rate limits, wait a few minutes before trying again

## Code Structure Decisions

### Authentication Pattern

- Using React Context API for managing auth state (AuthContext)
- ProtectedRoute component for securing routes
- Direct Supabase client for authentication
- Added robust error handling for rate limits and other errors

### Environment Variable Handling

For environment variables, initially had a complex setup with multiple fallbacks (window.ENV_CONFIG, window.RUNTIME_CONFIG, process.env), but ultimately simplified to use:

1. React's standard process.env for build-time variables
2. Properly mapping Vercel environment variables during build

## Future Plans

The application is designed as a metrics-tracking platform connecting development metrics to business outcomes, with these main features:

1. Authentication system
2. Dashboard for metrics visualization
3. Settings for user configuration
4. AI Agents integration

---

## Documentation Updates

The project documentation has been updated to reflect the current architecture and implementation details:

1. **infrastructure_and_deployment.md**: New document detailing Vercel deployment configuration, environment variable setup, and Supabase integration.

2. **auth_implementation.md**: New document explaining the authentication architecture using Supabase Auth, including flows, error handling, and code examples.

3. **tech_stack_document.md**: Updated to reflect the use of Supabase instead of a custom Node.js backend and Vercel for deployment.

4. **backend_structure_document.md**: Clarified the client-side approach to API integration and the use of Supabase's managed services.

These documents provide important context for understanding how the application is structured and deployed.

Last Updated: March 15, 2025