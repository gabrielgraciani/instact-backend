const connection = require('../database/connection');

module.exports = {
	async index (req, res) {
		const ongs = await connection('users').select('*');

		return res.json(ongs);
	},

	async create (req, res) {
		const { name, email, created_at} = req.body;

		try {

			const [id] = await connection('users').insert({
				name,
				email,
				created_at,
			});
	
			return res.json({ 
				success: true, 
				message: "User successfully created"
			});

		} catch (err) {

			return res.status(400).json({ 
				success: false, 
				error: { 
					message: "Error inserting user" 
				} 
			});

		}
	},

	async update (req, res) {
		const { id } = req.params;

		const { name, email } = req.body;

		try {

			const user = await connection('users').where('id', id).select('*').first();

			if (!user) {
				return res.status(400).json({ 
					success: false,
					 error: {
						 message: 'No User found with this ID'
					 }
				});
			}
	
			await connection('users').where('id', id).update({
				name,
				email
			});
	
			return res.json({ 
				success: true,
				message: "User successfully updated"
			});

		} catch (err) {

			return res.status(400).json({ 
				success: false, 
				error: { 
					message: "Error updating user" 
				} 
			});

		}
	},

	async delete (req, res) {
		const { id } = req.params;

		try {

			const user = await connection('users').where('id', id).select('id').first();

			if (!user) {
				return res.status(400).json({ 
					success: false,
					error: {
						message: 'No User found with this ID'
					}  
				});
			}
	
			await connection('users').where('id', id).delete();
	
			return res.json({ 
				success: true,
				 message: "User successfully deleted" 
			});
			
		} catch (err) {

			return res.status(400).json({ 
				success: false, 
				error: { 
					message: "Error deleting user" 
				} 
			});

		}


	}
};