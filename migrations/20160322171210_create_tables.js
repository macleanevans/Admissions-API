
exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    CREATE TABLE users (
      user_id SERIAL,
      name varchar(80),
      email varchar(30),
      github varchar(30),
      blackout date,
      PRIMARY KEY (user_id)
    );

    CREATE TABLE interviews (
      interview_id SERIAL,
      user_id INTEGER,
      interviewer_id INTEGER,
      decision varchar(50),
      technical_grade varchar(2),
      personal_grade  varchar(2),
      maker_prep  varchar(5),
      notes varchar(500),
      PRIMARY KEY (interview_id)
    );


    CREATE TABLE interviewer(
      interviewer_id SERIAL,
      full_name varchar(70),
      PRIMARY KEY (interviewer_id)
    );

    ALTER TABLE interviews ADD FOREIGN KEY (interviewer_id) REFERENCES interviewer (interviewer_id);
    ALTER TABLE interviews ADD FOREIGN KEY (user_id) REFERENCES users(user_id);

    `)
};

exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('users'),
      knex.schema.dropTable('interviews'),
      knex.schema.dropTable('interviewer'),
      knex.schema.dropTable('decision'),
      knex.schema.dropTable('grade'),
      knex.schema.dropTable('maker_prep'),
    ])
};
