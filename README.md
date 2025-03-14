# DevBizOps

DevBizOps is a unified dashboard that connects technical and business metrics for startup founders, providing insights into how technical operations impact business growth.

## Project Overview

This project aims to bridge the gap between technical operations and business growth for startup founders by:

1. Providing a unified dashboard that displays both technical and business metrics
2. Offering AI-powered agents that translate business needs into technical requirements
3. Enabling customizable views based on user roles and priorities

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js (planned)
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Visualization**: Chart.js, React-ChartJS-2

## Project Structure

```
DevBizOps/
├── documentation/       # Project documentation
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   ├── src/            # Source code
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── utils/      # Utility functions
│   │   └── routes/     # Application routing
└── backend/            # Backend services (planned)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/DevBizOps.git
   cd DevBizOps
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Create a `.env` file in the frontend directory with your Supabase credentials (or copy from `.env.example`):
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   > **Note:** For development purposes, the application includes a mock Supabase client when environment variables are not properly configured.

4. Start the development server:
   ```
   npm start
   ```

## Supabase Setup

1. Create a new project in the [Supabase Dashboard](https://app.supabase.io/)
2. Set up the following tables in your Supabase database:

### Tables

#### profiles
- id (uuid, primary key, references auth.users.id)
- name (text)
- role (text)
- created_at (timestamp with time zone)

#### metrics
- id (uuid, primary key)
- user_id (uuid, references auth.users.id)
- name (text)
- value (numeric)
- category (text) - 'technical' or 'business'
- unit (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

#### metric_history
- id (uuid, primary key)
- metric_id (uuid, references metrics.id)
- value (numeric)
- timestamp (timestamp with time zone)

#### user_favorites
- id (uuid, primary key)
- user_id (uuid, references auth.users.id)
- metric_id (uuid, references metrics.id)

## Features

### Implemented
- User authentication (login/register)
- Dashboard layout with responsive sidebar
- Settings page structure with tabs for General, Profile, Security, and Integrations
- Notification system for user feedback (success, error, warning, info messages)
- Supabase integration for authentication and data storage
- Integration management for external services

### Planned
- Real-time metrics updates
- AI-powered agent for business-technical translation
- Custom dashboard views based on user role
- Metric history visualization
- Alert system for metric thresholds

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# Trigger redeploy Fri Mar 14 21:56:18 CET 2025
