const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
	async index (req, res) {
		const likes = await connection('posts_likes').select('*');

		return res.json(likes);
	},

};