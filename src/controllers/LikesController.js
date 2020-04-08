const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const likes = await connection('posts_likes').select('*');

		return res.json(likes);
	},

	async create (req, res) {
		const users_id = req.headers.authorization;
		const { posts_id } = req.body;

		try {

			const post = await connection('posts').where('id', posts_id).select('*').first();

			if (!post) {
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "No Post found with this ID",
				});
			}

			if(post.users_id.toString() !== users_id.toString()){
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "You cannot like this post",
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
				message: "Error inserting post",
			});

		}
	},

	async delete (req, res) {
		const { id } = req.params;
		const users_id = req.headers.authorization;

		try {

			const like = await connection('likes').where('id', id).select('id', 'users_id').first();

			if (!like) {
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "No Post found with this ID",
				});
			}

			if(like.users_id.toString() !== users_id.toString()){
				return res.status(400).json({
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