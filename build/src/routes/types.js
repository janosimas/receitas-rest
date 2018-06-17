"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.get('/types', (req, res) => {
        res.json({
            cooking_method: [
                'fogão',
                'forno',
                'forno combinado'
            ],
        });
    });
};
//# sourceMappingURL=types.js.map