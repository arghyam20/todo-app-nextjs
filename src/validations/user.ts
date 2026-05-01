import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
})

export const signupBaseSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().label('Name'),
  email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
})

export const signupSchema = signupBaseSchema.keys({
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm Password'),
})


export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).label('Name'),
  email: Joi.string().email({ tlds: { allow: false } }).label('Email'),
})
