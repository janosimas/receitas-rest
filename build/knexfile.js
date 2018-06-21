"use strict";
// Update with your config settings.
module.exports = {
    development: {
        client: 'sqlite3',
        connection: { filename: './dev.sqlite' },
        migrations: {
            directory: './migrations',
            extensions: ['.ts'],
        },
        useNullAsDefault: true
    },
    staging: {
        client: 'sqlite3',
        connection: { filename: './mydb.sqlite' },
        migrations: {
            directory: './migrations',
            extensions: ['.ts'],
        },
        useNullAsDefault: true
    },
    test: {
        client: 'sqlite3',
        connection: { filename: './test.sqlite' },
        migrations: {
            directory: './migrations',
            extensions: ['.ts'],
        },
        useNullAsDefault: true
    },
    production: {
        client: 'sqlite3',
        connection: { filename: './recipes.sqlite' },
        migrations: {
            directory: './migrations',
            extensions: ['.ts'],
        }
    },
    useNullAsDefault: true
};
//# sourceMappingURL=knexfile.js.map