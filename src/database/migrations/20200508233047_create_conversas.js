exports.up = function(knex) {
	return knex.schema.createTable('conversas', function (table) {
		table.increments();
		table.dateTime('created_at').nullable();
		table.dateTime('updated_at').nullable();
		table.int('users_id1').notNullable();
		table.foreign('users_id1').references('id').inTable('users');
		table.int('users_id2').notNullable();
		table.foreign('users_id2').references('id').inTable('users');
		table.string('nome1').notNullable();
		table.string('username1').notNullable();
		table.string('profile_image1').notNullable();
		table.string('nome2').notNullable();
		table.string('username2').notNullable();
		table.string('profile_image2').notNullable();

	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('conversas');
};
