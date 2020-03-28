const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const UsersController = require('./controllers/UsersController');

const routes = express.Router();

routes.get('/users', UsersController.index);

routes.post('/users', celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email(),
	}),
}), UsersController.create);

routes.put('/users/:id', celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: Joi.number().required(),
	}),
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string(),
		email: Joi.string().email(),
	})
}), UsersController.update);

routes.delete('/users/:id', celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: Joi.number().required(),
	}),
}), UsersController.delete);

module.exports = routes;