"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const RecipeModel_1 = require("./RecipeModel");
let IngredientModel = class IngredientModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], IngredientModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], IngredientModel.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(type => RecipeModel_1.RecipeModel, recipe => recipe.ingredients),
    __metadata("design:type", RecipeModel_1.RecipeModel)
], IngredientModel.prototype, "recipe", void 0);
IngredientModel = __decorate([
    typeorm_1.Entity()
], IngredientModel);
exports.IngredientModel = IngredientModel;
//# sourceMappingURL=IngredientModel.js.map