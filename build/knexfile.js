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
    /**
     * @todo Assign a non-root user with a proper password before deploying!
     */
    test: {
        client: 'sqlite3',
        connection: { filename: './test.sqlite' },
        migrations: {
            directory: './migrations',
            extensions: ['.ts'],
        },
        useNullAsDefault: true
    },
    /**
     * @todo Assign a non-root user with a proper password before deploying!
     */
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