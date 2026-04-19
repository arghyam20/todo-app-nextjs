export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },
  TODOS: {
    BASE: '/api/todos',
    BY_ID: (id: number) => `/api/todos/${id}`,
  },
} as const

export const APP_CONSTANTS = {
  APP_NAME: 'Todo App',
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
} as const