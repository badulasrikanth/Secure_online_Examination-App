# Online Exam System - Frontend

A modern React frontend application for an online exam system built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Authentication**: Login and registration for students and administrators
- **Exam Management**: View available exams, take exams with timer
- **Admin Dashboard**: Create exams, add questions, manage content
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Timer**: Countdown timer for exams
- **JWT Authentication**: Secure API communication

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **JWT** - Authentication tokens

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── exam/          # Exam-related components
│   └── admin/         # Admin dashboard components
├── contexts/          # React contexts (Auth)
├── services/          # API service layer
└── types/            # TypeScript type definitions
```

## API Integration

The frontend communicates with a Spring Boot backend API. Make sure the backend is running on `http://localhost:8080`.

### Key Endpoints Used:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/exams` - Get available exams
- `POST /api/exams/{id}/submit` - Submit exam answers
- `GET /api/admin/exams` - Admin exam management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Students**: View available exams and take them within the time limit
3. **Admins**: Access admin dashboard to create exams and manage questions
4. **Exam Taking**: Answer questions with multiple choice options
5. **Results**: View scores after exam submission

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Test components thoroughly
4. Update documentation as needed
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
