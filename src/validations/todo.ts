import Joi from 'joi'

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
