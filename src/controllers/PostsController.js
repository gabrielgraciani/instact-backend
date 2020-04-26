const connection = require('../database/connection');
const moment = require('moment');
const fs = require('fs');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const path = require('path');
const { promisify } = require('util');

module.exports = {
	async index (req, res) {

		const { page = 1 } = req.query;

		const posts = await connection
		.select([
			'posts.*',
			'users.name', 'users.username', 'users.profile_image',
			connection.raw('(SELECT COUNT(*) from posts_likes WHERE posts_likes.posts_id = posts.id) AS qt_likes'),
			connection.raw('(SELECT COUNT(*) from posts_comments WHERE posts_comments.posts_id = posts.id) AS qt_comments'),
		])
		.from('posts')
		.innerJoin('users', 'users.id', '=', 'posts.users_id')
		.orderBy('posts.created_at', 'DESC')
		.limit(6)
		.offset((page -1) * 6);


		return res.json(posts);
	},

	async create (req, res) {
		const { description, users_id } = req.body;

		try {

			const created_at = moment().format();

			const user = await connection('users').where('id', users_id).select('username', 'name', 'profile_image').first();

			const [id] = await connection('posts').insert({
				description,
				file: req.file.filename,
				created_at,
				users_id,
			});

			return res.json({
				success: true,
				message: "Post successfully created",
				post: {
					id,
					description,
					file: req.file.filename,
					created_at,
					users_id,
					comments: [],
					likeId: '',
					likes: [],
					qt_comments: 0,
					qt_likes: 0,
					name: user.name,
					username: user.username,
					profile_image: user.profile_image
				}
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting post",
			});

		}
	},

	async update (req, res) {
		const { id } = req.params;
		const users_id = req.headers.authorization;

		const { description } = req.body;

		try {

			const post = await connection('posts').where('id', id).select('*').first();

			if (!post) {
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "No Post found with this ID",
				});
			}

			if(post.users_id.toString() !== users_id.toString()){
				return res.status(401).json({
					success: false,
					error: 'Bad Request',
					message: "This Post cannot update the post",
				});
			}

			if(post.file !== ''){
				if(process.env.STORAGE_TYPE === 's3'){
					await s3.deleteObject({
						Bucket: process.env.BUCKET,
						Key: `posts/${post.file}`
					}).promise();
				} else {
					promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${post.file}`));
				}
			}

			await connection('posts').where('id', id).update({
				description,
				file: req.file.filename,
			});

			return res.json({
				success: true,
				message: "Post successfully updated"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error updating post",
			});

		}
	},

	async delete (req, res) {
		const { id } = req.params;
		const users_id = req.headers.authorization;

		try {

			const post = await connection('posts').where('id', id).select('id', 'users_id', 'file').first();

			if (!post) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No Post found with this ID",
				});
			}

			if(post.users_id.toString() !== users_id.toString()){
				return res.status(401).json({
					success: false,
					error: 'Bad Request',
					message: "This Post cannot delete the post",
				});
			}

			if(post.file !== ''){
				if(process.env.STORAGE_TYPE === 's3'){
					await s3.deleteObject({
						Bucket: process.env.BUCKET,
						Key: `posts/${post.file}`
					}).promise();
				} else {
					promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${post.file}`));
				}
			}

			await connection('posts').where('id', id).delete();

			return res.json({
				success: true,
				message: "Post successfully deleted"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error deleting post",
			});

		}
	},

	async find (req, res) {
		const { id } = req.params;

		try {

			const post = await connection
			.select([
				'posts.*',
				'users.name', 'users.username', 'users.profile_image',
				connection.raw('(SELECT COUNT(*) from posts_likes WHERE posts_likes.posts_id = posts.id) AS qt_likes'),
				connection.raw('(SELECT COUNT(*) from posts_comments WHERE posts_comments.posts_id = posts.id) AS qt_comments'),
			])
			.from('posts')
			.innerJoin('users', 'users.id', '=', 'posts.users_id')
			.where('posts.id', id).first();

			if (!post) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No post found with this ID",
				});
			}

			return res.json(post);

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error finding post",
			});

		}
	},

	async findAllPostsFromUser (req, res) {
		const { id } = req.params;
		const { page = 1, limit = 6, posts_id = '' } = req.query;

		try {

			const post = await connection
			.select([
				'posts.*',
				connection.raw('(SELECT COUNT(*) from posts_likes WHERE posts_likes.posts_id = posts.id) AS qt_likes'),
				connection.raw('(SELECT COUNT(*) from posts_comments WHERE posts_comments.posts_id = posts.id) AS qt_comments'),
			])
			.from('posts')
			.where('users_id', id)
			.whereNot('posts.id', posts_id)
			.orderBy('posts.created_at', 'DESC')
			.limit(limit)
			.offset((page -1) * limit);

			if (!post) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No post found with this ID",
				});
			}

			return res.json(post);

		} catch (err) {
			console.log('err', err);

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error finding post",
			});

		}
	},

};