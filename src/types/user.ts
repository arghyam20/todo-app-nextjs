export interface User {
  id: number
  name: string
  email: string
  image?: string | null
  createdAt: string
  updatedAt?: string
}


export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}
