# DevBizOps Project Guidelines for Claude

## Build/Test Commands
- Build: `cd frontend && npm run build`
- Development: `cd frontend && npm start`
- Build with env: `cd frontend && ./scripts/build-with-env.sh`
- Tests: `cd frontend && npm test`
- Single test: `cd frontend && npm test -- -t "test name"`

## Code Style Guidelines

### Structure
- React functional components with hooks
- Context API for global state management
- Protected routes pattern for auth
- Tailwind CSS for styling

### Naming
- PascalCase for components (Dashboard.js)
- camelCase for variables and functions
- use* prefix for hooks (useAuth)
- handle* prefix for event handlers (handleSubmit)

### Imports (in order)
1. React and hooks
2. Third-party components
3. Local components
4. Contexts/services
5. Utilities/helpers

### Error Handling
- Try/catch for async operations
- Display user-friendly errors via NotificationContext
- Fallback UI for error states
- Supabase rate limiting handled explicitly

### Authentication
- Supabase Auth for authentication
- Environment variables: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY
- Protected routing for authenticated areas