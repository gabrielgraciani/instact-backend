exports.up = function(knex) {
	return knex.schema.createTable('posts', function (table) {
		table.increments();
		table.string('description').notNullable();
		table.string('file').notNullable();
		table.dateTime('created_at').nullable();
		table.int('users_id').notNullable();
		table.foreign('users_id').references('id').inTable('users');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('posts');
};
