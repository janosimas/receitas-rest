"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class IngredientModel extends objection_1.Model {
    constructor(name) {
        super();
        this.id = undefined;
        this.name = name;
    }
}
IngredientModel.tableName = 'recipe-ingredients';
exports.IngredientModel = IngredientModel;
//# sourceMappingURL=ingredientModel.js.map