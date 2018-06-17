"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
class IngredientName extends objection_1.Model {
}
IngredientName.tableName = 'ingredient-name';
exports.IngredientName = IngredientName;
class Ingredient extends objection_1.Model {
}
Ingredient.tableName = 'ingredients';
Ingredient.relationMappings = {
    names: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: IngredientName,
        join: {
            from: 'ingredients.id',
            to: 'ingredient-names.ingredientId'
        }
    }
};
exports.Ingredient = Ingredient;
//# sourceMappingURL=ingredients.js.map