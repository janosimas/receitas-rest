// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

import {RecipeModel} from '../models/recipeModel';
import {server} from '../server';

process.env.NODE_ENV = 'development';

const should = chai.should();

chai.use(chaiHttp);

describe('recipes', () => {
  before(async () => {  // Before tests we empty the database
    await RecipeModel.query().delete();
  });

  afterEach(async () => {  // After each test we empty the database
    await RecipeModel.query().delete();
  });


  const nameUpper = 'Tomato Salad';
  const nameLower = nameUpper.toLowerCase();
  const ingredientsUpper = ['Cenoura ', 'Tomate', 'oregano'];
  const ingredientsLower =
      [{name: 'cenoura'}, {name: 'tomate'}, {name: 'oregano'}];

  describe('/POST recipes', async () => {
    it('Register a new recipe with no ingredients.', (done) => {
      chai.request(server)
          .post('/recipe')
          .send({name: nameUpper})
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
      chai.request(server)
          .post('/recipe')
          .send({name: nameUpper, ingredients: ingredientsUpper})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('ingredients');
            res.body.should.have.property('id');
            res.body.name.should.be.eql(nameLower);
            res.body.ingredients.should.be.eql(ingredientsLower);
            done();
          });
    });

    it('Register a same recipe twice.', (done) => {
      chai.request(server)
          .post('/recipe')
          .send({name: nameUpper})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('ingredients');
            res.body.should.have.property('id');
            res.body.name.should.be.eql(nameLower);

            chai.request(server)
                .post('/recipe')
                .send({name: nameUpper})
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
      chai.request(server).get('/recipe/list').end((err, res) => {
        const body = res.body;
        body.should.be.an('array').that.have.lengthOf(0);
        chai.request(server)
            .post('/recipe')
            .send({name: nameUpper})
            .end((err, res) => {
              chai.request(server).get('/recipe/list').end((err, res) => {
                const body = res.body;
                body.should.have.lengthOf(1);
                body[0].should.have.property('name');
                body[0].name.should.be.equal(nameLower);
                done();
              });
            });
      });
    });
  });
});
