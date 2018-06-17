"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.get('/recipes', (req, res) => {
        if (!req.query.contains) {
            // full list of recipes
            res.json({ recipes: 'recipes' });
        }
        else {
            // autocomplete
            res.json({});
        }
    });
};
//# sourceMappingURL=recipes.js.map