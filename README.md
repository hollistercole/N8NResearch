# Research Task Navigator

A modern web application built with Next.js that displays research tasks completed by an agentic AI researcher.

## Overview

The Research Task Navigator provides a clean, intuitive interface for accessing and reviewing AI-generated research. The application follows a hierarchical structure:

- **Tasks**: Main research initiatives with overall status tracking
- **Subtasks**: Component parts of a research task
- **Products**: Deliverables created for each subtask (articles, reports, data sets, etc.)

## Features

- Mobile-first, responsive design that works seamlessly on all devices
- Hierarchical navigation from tasks to subtasks to products
- Visual status indicators for task completion
- Clean, modern UI built with Tailwind CSS
- Fast, server-side rendered pages with Next.js

## Prerequisites

- Node.js 18.17.0 or later
- npm or yarn
- MariaDB server connection

## Getting Started

First, set up your environment variables by creating a `.env.local` file:

```
DB_HOST=54.176.154.219
DB_PORT=3306
DB_USER=cgdata
DB_PASSWORD=your_password_here
DB_NAME=AgentTasks
```

Then, install the dependencies:

```bash
npm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/
├── .env.local           # Environment variables (create this file)
├── src/
│   ├── app/
│   │   ├── api/         # API endpoints for data access
│   │   ├── tasks/       # Main tasks listing and individual task pages
│   │   ├── subtasks/    # Subtask detail pages
│   │   ├── products/    # Product detail pages
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Homepage (tasks listing)
│   ├── lib/
│   │   └── db.ts        # Database connection library
│   └── types/
│       └── index.ts     # TypeScript type definitions
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Data Model

The application uses a hierarchical data model:

- Tasks contain multiple subtasks
- Subtasks contain multiple products
- Products can be of various types (articles, reports, datasets)

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs) 