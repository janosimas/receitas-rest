// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: "./mydb.sqlite"
    },
    migrations: {
      directory: '../migrations',
      extensions: ['.ts'],

    },
    useNullAsDefault: true
  },

  /**
   * @todo Assign a non-root user with a proper password before deploying!
   */
  staging: {
    client: 'sqlite3',
    connection: {
      filename: "./mydb.sqlite"
    },
    migrations: {
      directory: '../migrations',
      extensions: ['.ts'],

    },
    useNullAsDefault: true
  },

  /**
   * @todo Assign a non-root user with a proper password before deploying!
   */
  production: {
    client: 'sqlite3',
    connection: {
      filename: "./mydb.sqlite"
    },
    migrations: {
      directory: '../migrations',
      extensions: ['.ts'],

    }
  },
  useNullAsDefault: true
};