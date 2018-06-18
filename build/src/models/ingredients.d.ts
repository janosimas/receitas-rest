import { Model } from 'objection';
export declare class Ingredient extends Model {
    static tableName: string;
    readonly id: number;
    name: string;
}
