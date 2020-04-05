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
	}

};