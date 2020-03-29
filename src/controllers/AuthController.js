const connection = require('../database/connection');


module.exports = {
	async index (req, res) {
		const { email, password } = req.body;

		try{

			const user = await connection('users').where('email', email).where('password', password).select('*').first();

			if(!user){
				return res.status(400).json({
					success: false,
					error: {
						message: 'No User found with this Email and Password'
					}
				});
			}

			return res.json(user);

		} catch (err) {

			return res.status(400).json({
				success: false,
				error: {
					message: "Login is not working"
				}
			});


		}

	}
};