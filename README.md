# Todo App with Next.js

A full-stack todo application built with Next.js, featuring user authentication, todo management, and a modern UI.

## Features

- **User Authentication**: Sign up, login, and logout functionality
- **Todo Management**: Create, read, update, and delete todos
- **User Dashboard**: View and manage your todos
- **Profile Management**: Update user profile information
- **Responsive Design**: Built with Tailwind CSS and Material-UI
- **Database**: MySQL with Prisma ORM
- **Type Safety**: Full TypeScript support
- **Code Quality**: ESLint, Prettier, and Husky for consistent code

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Material-UI
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Joi schemas
- **Development**: ESLint, Prettier, Husky

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app-nextjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

Start the MySQL database using Docker:

```bash
npm run docker:up
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="mysql://todo_user:todo_password@localhost:3306/todo_app"
JWT_SECRET="your-secret-key-here"
```

### 5. Set Up the Database Schema

Push the Prisma schema to the database:

```bash
npm run db:push
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:14500](http://localhost:14500) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run db:push` - Push Prisma schema to database
- `npm run db:migrate` - Create and run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers

## Project Structure

```
src/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   └── todos/             # Todo CRUD endpoints
├── app/                   # Next.js app router pages
│   ├── dashboard/         # User dashboard
│   ├── login/            # Login page
│   ├── profile/          # User profile
│   └── signup/           # Signup page
├── components/            # Reusable React components
├── config/               # Configuration files
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── validations/          # Input validation schemas

prisma/
├── schema.prisma         # Database schema
└── models/               # Prisma model files
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Todos
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get a specific todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Database Schema

The application uses two main models:

### User
- `id`: Primary key
- `email`: Unique email address
- `password`: Hashed password
- `name`: User's name
- `createdAt`/`updatedAt`: Timestamps

### Todo
- `id`: Primary key
- `title`: Todo title
- `description`: Optional description
- `completed`: Completion status
- `dueDate`: Optional due date
- `userId`: Foreign key to User
- `createdAt`/`updatedAt`: Timestamps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
