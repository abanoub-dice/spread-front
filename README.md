# Modern React Application Template

A feature-rich, production-ready React application template built with modern technologies and best practices.

## 🚀 Key Features

- ⚛️ React 19 with TypeScript support
- 🎨 Material-UI (MUI) v7 for beautiful, responsive UI components
- 📱 React Router v7 for advanced routing capabilities
- 🎯 Zustand for lightweight state management
- 🔄 React Query for efficient data fetching and caching
- 📝 Form handling with React Hook Form and Yup validation
- 🎨 Styling with Tailwind CSS and Styled Components
- 📅 Date handling with Day.js
- 📤 File upload capabilities with React Dropzone
- 🔍 TypeScript for enhanced development experience

## 🛠️ Tech Stack

### Core Dependencies
- React 19
- TypeScript
- React Router 7
- Material-UI 7
- Zustand
- React Query
- React Hook Form
- Tailwind CSS
- Styled Components

### Development Tools
- Vite 6
- TypeScript 5.8
- React Router Dev Tools

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abanoub-dice/spread-front.git
cd spread-front
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Type Checking

Run type checking:
```bash
npm run typecheck
```

## 🏗️ Building for Production

Create a production build:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 🐳 Docker Support

The application includes Docker configuration for easy deployment and development.

### Using Docker Compose (Recommended)

Run the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at `http://localhost:3003`

### Using Docker Directly

Build the Docker image:
```bash
docker build -t spread-frontend .
```

Run the container:
```bash
docker run -p 3003:3000 spread-frontend
```

### Docker Features

- **Multi-stage build** for optimized production images
- **Health checks** for container monitoring
- **Production-ready** configuration
- **Automatic restart** policy
- **Port mapping** (3003:3000)

## 📦 Project Structure

```
├── app/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── layouts/       # Layout components
│   ├── routes/        # Route components
│   ├── utils/         # Utility functions and stores
│   │   ├── store/     # Zustand stores
│   │   │   ├── userStore.ts      # User authentication store
│   │   │   ├── dialogueStore.ts  # Dialog/modal store
│   │   │   ├── loaderStore.ts    # Loading state store
│   │   │   └── zustandHooks.ts   # Zustand hooks
│   │   ├── api/       # API services
│   │   │   ├── authApis.ts       # Authentication APIs
│   │   │   └── axiosInstance.ts  # Axios configuration
│   │   ├── theme/     # Theme configuration
│   │   │   ├── theme.ts          # Main theme
│   │   │   ├── palette.ts        # Color palette
│   │   │   ├── typography.ts     # Typography styles
│   │   │   └── types.ts          # Theme types
│   │   ├── interfaces/ # TypeScript interfaces
│   │   │   ├── user.ts           # User types
│   │   │   ├── category.ts       # Category types
│   │   │   └── projects/         # Project interfaces
│   │   ├── constants/ # Constants
│   │   │   └── queryKeys.ts      # React Query keys
│   │   └── date/      # Date utilities
│   │       └── dayjs.ts          # Day.js configuration
│   └── assets/        # Static assets
├── public/            # Static assets
└── build/            # Production build output
```

## 🎨 UI Components

This project uses Material-UI (MUI) v7 as its primary component library, providing:
- Pre-built, customizable components
- Responsive design system
- Theme customization
- Icon system
- Date picker components

## 📝 Form Handling

The project implements robust form handling with:
- React Hook Form for form state management
- Yup for schema validation
- Material-UI form components integration

## 🔄 State Management

- **Zustand** for lightweight global state management
  - User authentication state
  - Dialog/modal state
  - Loading state
- **React Query** for server state management
- **Local state** management with React hooks

## 🚀 Deployment

The application can be deployed to any platform that supports Node.js applications, including:
- Vercel
- Netlify
- AWS
- Google Cloud Platform
- Azure
- Heroku

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Query Documentation](https://tanstack.com/query/latest)


---

Built using modern React technologies.
