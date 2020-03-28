const connection = require('../database/connection');

module.exports = {
	async index (req, res) {
		const ongs = await connection('users').select('*');

		return res.json(ongs);
	},

	async create (req, res) {
		const { name, email, created_at} = req.body;

		const [id] = await connection('users').insert({
			name,
			email,
			created_at,
		});

		return res.json({ message: "User successfully created" });
	},

	async update (req, res) {
		const { id } = req.params;

		const { name, email } = req.body;

		const user = await connection('users').where('id', id).select('*').first();

		if (!user) {
			return res.status(400).json({ error: 'No User found with this ID' });
		}

		await connection('users').where('id', id).update({
			name,
			email
		});

		return res.json({ message: "User successfully updated" });
	},

	async delete (req, res) {
		const { id } = req.params;

		const user = await connection('users').where('id', id).select('id').first();

		if (!user) {
			return res.status(400).json({ error: 'No User found with this ID' });
		}

		await connection('users').where('id', id).delete();

		return res.json({ message: "User successfully deleted" });
	}
};