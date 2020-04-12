const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const likes = await connection
		.select([
			'posts_likes.*',
			'users.username',
			'users.profile_image'
		])
		.from('posts_likes')
		.innerJoin('users', 'users.id', '=', 'posts_likes.users_id');

		return res.json(likes);
	},

	async create (req, res) {
		const users_id = req.headers.authorization;
		const { posts_id } = req.body;

		try {

			const post = await connection('posts').where('id', posts_id).select('*').first();
			const user = await connection('users').where('id', users_id).select('id').first();

			if (!post) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No Post found with this ID",
				});
			}

			if (!user) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No User found to like this post",
				});
			}

			const created_at = moment().format();

			await connection('posts_likes').insert({
				created_at,
				posts_id,
				users_id,
			});

			return res.json({
				success: true,
				message: "Post successfully created"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error inserting like",
			});

		}
	},

	async delete (req, res) {
		const { id } = req.params;
		const users_id = req.headers.authorization;

		try {

			const like = await connection('posts_likes').where('id', id).select('id', 'users_id').first();

			if (!like) {
				return res.status(404).json({
					success: false,
					error: 'Bad Request',
					message: "No Post found with this ID",
				});
			}

			if(like.users_id.toString() !== users_id.toString()){
				return res.status(401).json({
					success: false,
					error: 'Bad Request',
					message: "You cannot delete the like",
				});
			}

			await connection('posts_likes').where('id', id).delete();

			return res.json({
				success: true,
				message: "Like successfully deleted"
			});

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: 'Bad Request',
				message: "Error deleting like",
			});

		}
	},

};