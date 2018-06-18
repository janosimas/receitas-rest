// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

import {Ingredient} from '../models/ingredients';
import {server} from '../server';

process.env.NODE_ENV = 'development';

const should = chai.should();

chai.use(chaiHttp);

describe('Ingredients', () => {
  before(async () => {  // Before tests we empty the database
    await Ingredient.query().delete();
  });

  afterEach(async () => {  // After each test we empty the database
    await Ingredient.query().delete();
  });

  const nameUpper = 'Tomato';
  const nameLower = nameUpper.toLowerCase();

  describe('/POST Ingredients', async () => {
    it('Register a new ingredient.', (done) => {
      chai.request(server)
          .post('/ingredients/new')
          .send({name: nameUpper})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.eql(nameLower);
            done();
          });
    });

    it('Register a same ingredient twice.', (done) => {
      chai.request(server)
          .post('/ingredients/new')
          .send({name: nameUpper})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.eql(nameLower);

            chai.request(server)
                .post('/ingredients/new')
                .send({name: nameUpper})
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('err');
                  res.body.err.should.be.equal(
                      'Ingredient already registered.');
                  done();
                });
          });
    });

    it('List ingredients.', (done) => {
      chai.request(server).get('/ingredients').end((err, res) => {
        const body = res.body;
        body.should.be.an('array').that.have.lengthOf(0);
        chai.request(server)
            .post('/ingredients/new')
            .send({name: nameUpper})
            .end((err, res) => {
              chai.request(server).get('/ingredients').end((err, res) => {
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
