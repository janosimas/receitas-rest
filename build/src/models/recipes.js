"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const ingredients_1 = require("./ingredients");
class Recipe extends objection_1.Model {
}
Recipe.tableName = 'recipes';
Recipe.relationMappings = {
    ingredients: {
        relation: objection_1.Model.ManyToManyRelation,
        modelClass: ingredients_1.Ingredient,
        join: {
            from: 'recipes.id',
            through: {
                from: 'recipe-ingredients.recipeId',
                to: 'recipe-ingredients.ingredientId'
            },
            to: 'ingredients.id'
        }
    }
};
exports.Recipe = Recipe;
//# sourceMappingURL=recipes.js.map