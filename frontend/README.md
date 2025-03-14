# DevBizOps Frontend

This is the frontend application for DevBizOps, built with React and Tailwind CSS. It provides a unified dashboard for connecting technical and business metrics.

## Directory Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts for state management
├── pages/          # Page components
├── services/       # API and external service integrations
├── utils/          # Utility functions
└── routes/         # Application routing
```

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Environment Setup

Create a `.env.local` file with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Available Scripts

- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Build for production

## Key Features

- Responsive dashboard layout
- Real-time metrics display
- User authentication via Supabase
- Role-based access control
- Customizable metric views
- Integration management

## Component Guidelines

- Use Tailwind CSS for styling
- Follow atomic design principles
- Implement error boundaries where needed
- Add PropTypes for component props
- Write unit tests for critical components

## State Management

- Use React Context for global state
- Implement custom hooks for reusable logic
- Handle loading and error states consistently

For more details about the overall project, see the main [README](../README.md).
