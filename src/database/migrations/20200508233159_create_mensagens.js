exports.up = function(knex) {
	return knex.schema.createTable('mensagens', function (table) {
		table.increments();
		table.dateTime('created_at').nullable();
		table.string('message').notNullable();
		table.int('users_id').notNullable();
		table.foreign('users_id').references('id').inTable('users');
		table.int('conversas_id').notNullable();
		table.foreign('conversas_id').references('id').inTable('conversas');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('mensagens');
};
