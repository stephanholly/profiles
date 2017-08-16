
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'username1', password: 'password1', email: 'email1@gmail.com'},
        {username: 'username2', password: 'password2', email: 'email2@gmail.com'},
        {username: 'username3', password: 'password3', email: 'email3@gmail.com'},
        {username: 'username4', password: 'password4', email: 'email4@gmail.com'},
        {username: 'username5', password: 'password5', email: 'email5@gmail.com'}
      ]);
    });
};
