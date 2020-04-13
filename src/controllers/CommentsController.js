const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {

		const comments = await connection
		.select([
			'posts_comments.*',
			'users.username',
		])
		.from('posts_comments')
		.innerJoin('users', 'users.id', '=', 'posts_comments.users_id')
		.orderBy('posts_comments.created_at', 'ASC');

		return res.json(comments);
	},

	async create (req, res) {
		const users_id = req.headers.authorization;
		const { comment, posts_id } = req.body;

		try {

			const post = await connection('posts').where('id', posts_id).select('*').first();
			const user = await connection('users').where('id', users_id).select('username').first();

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
					message: "You cannot comment this post",
				});
			}

			const created_at = moment().format();

			await connection('posts_comments').insert({
				created_at,
				comment,
				posts_id,
				users_id,
			});

			return res.json({
				success: true,
				message: "Comment successfully created",
				comment: {
					comment,
					username: user.username
				}
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting comment",
			});

		}
	},

	async delete (req, res) {
		const { id } = req.params;
		const users_id = req.headers.authorization;

		try {

			const comment = await connection('posts_comments').where('id', id).select('id', 'users_id').first();

			if (!comment) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No Comment found with this ID",
				});
			}

			if(comment.users_id.toString() !== users_id.toString()){
				return res.status(401).json({
					success: false,
					error: 'Bad Request',
					message: "You cannot delete the comment",
				});
			}

			await connection('posts_comments').where('id', id).delete();

			return res.json({
				success: true,
				message: "Comment successfully deleted"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error deleting comment",
			});

		}
	},

	async find (req, res) {
		const { id } = req.params;

		try {

			//const comments = await connection('posts_comments').where('posts_id', id).select('*').limit(3);

			const comments = await connection
			.select([
				'posts_comments.*',
				'users.username', 'users.profile_image'
			])
			.from('posts_comments')
			.innerJoin('users', 'users.id', '=', 'posts_comments.users_id')
			.where('posts_id', id);

			if (!comments) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No Comments found for this post",
				});
			}

			return res.json(comments);

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error finding comments",
			});

		}
	},

};