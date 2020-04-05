const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const multer = require('multer');
const multerConfig = require('./config/multer');

const UsersController = require('./controllers/UsersController');
const AuthController = require('./controllers/AuthController');

const routes = express.Router();

routes.get('/users', UsersController.index);

routes.post('/users', celebrate({
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string().required().email(),
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
}), UsersController.create);

routes.put('/users/:id', celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: Joi.number().required(),
	}),
	[Segments.BODY]: Joi.object().keys({
		name: Joi.string().allow(''),
		email: Joi.string().email().allow(''),
		username: Joi.string().allow(''),
		password: Joi.string().allow(''),
		biography: Joi.string().default('').allow(''),
		telephone: Joi.string().default('').allow(''),
		newpassword: Joi.string().allow(''),
		newpasswordconfirm: Joi.string().allow('')
	})
}), UsersController.update);

routes.delete('/users/:id', celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: Joi.number().required(),
	}),
}), UsersController.delete);

routes.get('/users/:id', celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		id: Joi.number().required(),
	}),
}) , UsersController.find);

routes.post('/authenticate', celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	}),
}), AuthController.index);

routes.post('/users/save-image/:id', multer(multerConfig).single('file'), UsersController.sendProfileImage);

module.exports = routes;