import {Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

import {IngredientModel, InterfaceIngredientModel} from './IngredientModel';

export interface InterfaceRecipeModel {
  id: number;
  name: string;
  ingredients: InterfaceIngredientModel[];
}

@Entity()
export class RecipeModel {
  @PrimaryGeneratedColumn() id?: number;

  @Column('text') name?: string;

  @OneToMany(type => IngredientModel, ingredient => ingredient.recipe, {
    cascade: true,
  })
  @JoinTable()
  ingredients?: IngredientModel[];
}
