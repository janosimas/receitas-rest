// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

import {Recipe} from '../models/recipes';
import {server} from '../server';

process.env.NODE_ENV = 'development';

const should = chai.should();

chai.use(chaiHttp);

describe('recipes', () => {
  before(async () => {  // Before tests we empty the database
    await Recipe.query().delete();
  });

  afterEach(async () => {  // After each test we empty the database
    await Recipe.query().delete();
  });

  const nameUpper = 'Tomato Salad';
  const nameLower = nameUpper.toLowerCase();

  describe('/POST recipes', async () => {
    it('Register a new recipe.', (done) => {
      chai.request(server)
          .post('/recipes/new')
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

    it('Register a same recipe twice.', (done) => {
      chai.request(server)
          .post('/recipes/new')
          .send({name: nameUpper})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('ingredients');
            res.body.should.have.property('id');
            res.body.name.should.be.eql(nameLower);

            chai.request(server)
                .post('/recipes/new')
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
      chai.request(server).get('/recipes').end((err, res) => {
        const body = res.body;
        body.should.be.an('array').that.have.lengthOf(0);
        chai.request(server)
            .post('/recipes/new')
            .send({name: nameUpper})
            .end((err, res) => {
              chai.request(server).get('/recipes').end((err, res) => {
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