import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RecipeModel } from './RecipeModel';

export interface InterfaceIngredientModel {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

@Entity()
export class IngredientModel {
  @PrimaryGeneratedColumn() id?: number;

  @Column({ type: 'text', nullable: false }) name!: string;
  @Column({ type: 'double', nullable: true }) quantity?: number;
  @Column({ type: 'text', nullable: true }) unit?: string;

  @ManyToOne(type => RecipeModel, recipe => recipe.ingredients)
  recipe?: RecipeModel;
}
