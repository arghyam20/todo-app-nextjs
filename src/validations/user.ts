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

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).label('Name'),
  email: Joi.string().email().label('Email'),
})
