// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

import { RecipeModel } from '../models/RecipeModel';

process.env.NODE_ENV = 'test';
// import { restServer } from '../restServer';
import { getConnection } from 'typeorm';
import { IngredientModel, InterfaceIngredientModel } from '../models/IngredientModel';
import { server } from '../server';

import * as R from 'ramda';

const should = chai.should();

chai.use(chaiHttp);

describe('recipes', () => {
  let restServer: Express.Application | void;
  before(async () => {
    restServer = await server;
    await clearDatabase();
  });

  afterEach(async () => {  // After each test we empty the database
    await clearDatabase();
  });


  const nameUpper = 'Tomato Salad';
  const nameLower = nameUpper.toLowerCase();
  const ingredientsUpper =
    [{ name: 'Cenoura' }, { name: 'Tomate' }, { name: 'oregano' }];
  const ingredientsLower =
    [{ name: 'cenoura' }, { name: 'oregano' }, { name: 'tomate' }];

  describe('/POST recipes', async () => {
    it('Register a new recipe with no ingredients.', (done) => {
      chai.request(restServer)
        .post('/recipe')
        .send({ name: nameUpper })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('id');
          res.body.name.should.be.eql(nameLower);
          done();
        });
    });

    it('Register a new recipe with ingredients.', (done) => {
      chai.request(restServer)
        .post('/recipe')
        .send({ name: nameUpper, ingredients: ingredientsUpper })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('id');
          res.body.name.should.be.eql(nameLower);

          let returnedIngredients: InterfaceIngredientModel[] = res.body.ingredients;
          returnedIngredients = R.sortBy(R.prop('name'))(returnedIngredients);

          Promise
            .all(returnedIngredients.map(
              (ingredient: { name: string }, index: number) =>
                ingredient.name.should.be.equal(
                  ingredientsLower[index].name)))
            .then(() => done());
        });
    });

    it('Register a same recipe twice.', (done) => {
      chai.request(restServer)
        .post('/recipe')
        .send({ name: nameUpper })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('ingredients');
          res.body.should.have.property('id');
          res.body.name.should.be.eql(nameLower);

          chai.request(restServer)
            .post('/recipe')
            .send({ name: nameUpper })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('err');
              res.body.err.should.be.equal('Recipe already registered.');
              done();
            });
        });
    });

    it('List recipes.', (done) => {
      chai.request(restServer).get('/recipe/list').end((err, res) => {
        const body = res.body;
        body.should.be.an('array').that.have.lengthOf(0);
        chai.request(restServer)
          .post('/recipe')
          .send({ name: nameUpper, ingredients: ingredientsUpper })
          .end((err, res) => {
            chai.request(restServer).get('/recipe/list').end((err, res) => {
              const body = res.body;
              body.should.have.lengthOf(1);
              body[0].should.have.property('name');
              body[0].name.should.be.equal(nameLower);

              let returnedIngredients: InterfaceIngredientModel[] = body[0].ingredients;
              returnedIngredients = R.sortBy(R.prop('name'))(returnedIngredients);

              Promise
                .all(returnedIngredients.map(
                  (ingredient: { name: string }, index: number) =>
                    ingredient.name.should.be.equal(
                      ingredientsLower[index].name)))
                .then(() => done());
            });
          });
      });
    });
  });
});

const clearDatabase = async () => {
  const ingredientsRepository = getConnection().getRepository(IngredientModel);
  const ingredients = await ingredientsRepository.find();
  await Promise.all(ingredients.map(
    ingredients => ingredientsRepository.remove(ingredients)));
  const recipeRepository = getConnection().getRepository(RecipeModel);
  const recipes = await recipeRepository.find();
  await Promise.all(recipes.map(recipe => recipeRepository.remove(recipe)));
};
