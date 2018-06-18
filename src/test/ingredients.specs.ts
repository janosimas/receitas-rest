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

  describe('/POST Ingredients', async () => {
    it('Register a new ingredient.', (done) => {
      chai.request(server)
          .post('/ingredients/new')
          .send({name: 'Tomato'})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.eql('Tomato');
            done();
          });
    });

    it('Register a same ingredient twice.', (done) => {
      chai.request(server)
          .post('/ingredients/new')
          .send({name: 'Tomato'})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.eql('Tomato');

            chai.request(server)
                .post('/ingredients/new')
                .send({name: 'Tomato'})
                .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('err');
                  res.body.err.should.be.eql('Ingredient already registered.');
                  done();
                });
          });
    });
  });
});
