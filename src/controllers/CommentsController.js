const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const comments = await connection('posts_comments').select('*');

		return res.json(comments);
	},

	async create (req, res) {
		const users_id = req.headers.authorization;
		const { comment, posts_id } = req.body;

		try {

			const post = await connection('posts').where('id', posts_id).select('*').first();

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
				message: "Comment successfully created"
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

};