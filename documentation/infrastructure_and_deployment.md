# Infrastructure and Deployment

## Overview

DevBizOps is deployed as a static site on Vercel, with backend services provided by Supabase. This document outlines the deployment architecture and key configuration details.

## Deployment Architecture

### Frontend Deployment

- **Platform**: Vercel
- **Build Command**: `cd frontend && npm install && CI=false REACT_APP_SUPABASE_URL=$SUPABASE_URL REACT_APP_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY npm run build`
- **Output Directory**: `frontend/build`
- **Framework**: Create React App

### Backend Services

- **Platform**: Supabase
- **Services Used**:
  - Supabase Auth for authentication
  - Supabase Database (PostgreSQL) for data storage
  - Supabase Storage for file storage (planned)

## Environment Variables

### Vercel Environment Variables

The following environment variables must be set in the Vercel project settings:

- `SUPABASE_URL`: The URL of your Supabase project
- `SUPABASE_ANON_KEY`: The anonymous/public API key for your Supabase project
- `SUPABASE_SERVICE_ROLE_KEY`: The service role key for administrative operations (not used client-side)

During the build process, these are mapped to the React-required format with the `REACT_APP_` prefix.

### Local Development Environment Variables

For local development, create a `.env.local` file in the project root with:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Vercel Configuration

The `vercel.json` file contains the essential configuration for deployment:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && CI=false REACT_APP_SUPABASE_URL=$SUPABASE_URL REACT_APP_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY npm run build",
  "outputDirectory": "frontend/build",
  "framework": "create-react-app"
}
```

This configuration:
1. Specifies the build command that runs in the frontend directory
2. Maps Vercel environment variables to React environment variables
3. Sets the output directory for the build
4. Indicates that the project uses Create React App

## Supabase Configuration

### Auth Configuration

Supabase Auth is configured to use:
- Email/password authentication
- Email confirmation for new accounts
- Password recovery functionality

Rate limiting protection is included in the client code to gracefully handle Supabase's free tier limits.

### Database Schema

The database schema includes:
- User profiles table (linked to auth.users)
- Metrics tables for tracking business and development KPIs
- Additional tables for AI agent interactions

For details, see the `supabase_schema.sql` file in the documentation folder.

## Troubleshooting Deployment Issues

Common issues and their solutions:
1. **Environment Variables**: Ensure all required environment variables are set in Vercel
2. **Build Failures**: Check the build logs for errors related to npm installation or build process
3. **Authentication Issues**: Verify Supabase credentials and rate limits
4. **Routing Problems**: Ensure the React Router configuration is correct and that Vercel routes are set properly

## CI/CD Pipeline

The current CI/CD process is:
1. Push changes to the main branch
2. Vercel automatically detects changes and starts the build process
3. Build is deployed to production if successful