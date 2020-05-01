const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const multer = require('multer');
const multerConfig = require('./config/multer');
const multerPostConfig = require('./config/multerPost');

const UsersController = require('./controllers/UsersController');
const AuthController = require('./controllers/AuthController');
const PostsController = require('./controllers/PostsController');
const FollowsController = require('./controllers/FollowsController');
const LikesController = require('./controllers/LikesController');
const CommentsController = require('./controllers/CommentsController');

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
routes.get('/users-by-username/:username', celebrate({
	[Segments.PARAMS]: Joi.object().keys({
		username: Joi.string().required(),
	}),
}) , UsersController.findByUsername);
routes.post('/authenticate', celebrate({
	[Segments.BODY]: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	}),
}), AuthController.index);
routes.post('/users/save-image/:id', multer(multerConfig).single('file'), UsersController.sendProfileImage);
routes.get('/sugestions/:id', UsersController.sugestions);
routes.get('/search/:search', UsersController.search);

routes.get('/posts', celebrate({
	[Segments.QUERY]: Joi.object().keys({
		page: Joi.number(),
	}),
}), PostsController.index);
routes.post('/posts', multer(multerPostConfig).single('file'), PostsController.create);
routes.put('/posts/:id', multer(multerPostConfig).single('file'), PostsController.update);
routes.delete('/posts/:id', PostsController.delete);
routes.get('/posts/:id', PostsController.find);
routes.get('/all-posts-from-user/:id', PostsController.findAllPostsFromUser);

routes.get('/follows', FollowsController.index);
routes.post('/follows/:sent_users_id&:received_users_id', FollowsController.create);
routes.delete('/follows/:sent_users_id&:received_users_id', FollowsController.delete);
routes.get('/follows/:id', FollowsController.find);
routes.delete('/follows-delete-all', FollowsController.deleteAll);

routes.get('/likes', LikesController.index);
routes.post('/likes', LikesController.create);
routes.delete('/likes/:id', LikesController.delete);
routes.get('/likes/:id', LikesController.find);

routes.get('/comments', CommentsController.index);
routes.post('/comments', CommentsController.create);
routes.delete('/comments/:id', CommentsController.delete);
routes.get('/comments/:id', CommentsController.find);

module.exports = routes;