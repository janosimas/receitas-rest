import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

import {RecipeModel} from './RecipeModel';

export interface InterfaceIngredientModel {
  id: number;
  name: string;
}

@Entity()
export class IngredientModel {
  @PrimaryGeneratedColumn() id?: number;

  @Column('text') name?: string;

  @ManyToOne(type => RecipeModel, recipe => recipe.ingredients)
  recipe?: RecipeModel;
}
