import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
})

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().label('Name'),
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm Password'),
})

export const todoSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().label('Title'),
  description: Joi.string().max(500).allow('', null).label('Description'),
  completed: Joi.boolean().label('Completed'),
  dueDate: Joi.date().iso().allow(null).label('Due Date'),
})

export const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(100).label('Title'),
  description: Joi.string().max(500).allow('', null).label('Description'),
  completed: Joi.boolean().label('Completed'),
  dueDate: Joi.date().iso().allow(null).label('Due Date'),
})