"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const ingredientModel_1 = require("./ingredientModel");
class RecipeModel extends objection_1.Model {
}
RecipeModel.tableName = 'recipes';
RecipeModel.relationMappings = {
    ingredients: {
        relation: objection_1.Model.HasManyRelation,
        modelClass: ingredientModel_1.IngredientModel,
        join: {
            from: 'recipes.id',
            to: 'recipe-ingredients.recipeId',
        }
    }
};
exports.RecipeModel = RecipeModel;
//# sourceMappingURL=recipeModel.js.map