const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const posts = await connection('posts').select('*');

		return res.json(posts);
	},

	async create (req, res) {
		const { description, users_id, file } = req.body;

		try {

			const created_at = moment().format();

			await connection('posts').insert({
				description,
				file,
				created_at,
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

	async update (req, res) {
		const { id } = req.params;
		const users_id = req.headers.authorization;

		const { description, file } = req.body;

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
				return res.status(400).json({
					success: false,
					error: 'Bad Request',
					message: "This Post cannot update the post",
				});
			}

			await connection('posts').where('id', id).update({
				description,
				file,
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

			const post = await connection('posts').where('id', id).select('id', 'users_id').first();

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
					message: "This Post cannot delete the post",
				});
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
	}

};