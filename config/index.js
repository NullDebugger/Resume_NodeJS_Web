const pkg = require('../package.json');

module.exports = {
  applicationName: pkg.name,
  mongodb: {
    url: 'mongodb://localhost:37017/smallshop',
  },
  redis: {
    port: 7379,
    client: null,
  },
  mysql: {
    options: {
      host: 'localhost',
      port: 3406,
      database: 'smallshop',
      dialect: 'mysql',
      username: 'root',
      password: 'mypassword',
    },
    client: null,
  },
};
