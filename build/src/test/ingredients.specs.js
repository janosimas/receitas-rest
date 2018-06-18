"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Require the dev-dependencies
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const ingredients_1 = require("../models/ingredients");
const server_1 = require("../server");
process.env.NODE_ENV = 'development';
const should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
describe('Ingredients', () => {
    before(() => __awaiter(this, void 0, void 0, function* () {
        yield ingredients_1.Ingredient.query().delete();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield ingredients_1.Ingredient.query().delete();
    }));
    describe('/POST Ingredients', () => __awaiter(this, void 0, void 0, function* () {
        it('Register a new ingredient.', (done) => {
            chai_1.default.request(server_1.server)
                .post('/ingredients/new')
                .send({ name: 'Tomato' })
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
            chai_1.default.request(server_1.server)
                .post('/ingredients/new')
                .send({ name: 'Tomato' })
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.eql('Tomato');
                chai_1.default.request(server_1.server)
                    .post('/ingredients/new')
                    .send({ name: 'Tomato' })
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('err');
                    res.body.err.should.be.eql('Ingredient already registered.');
                    done();
                });
            });
        });
    }));
});
//# sourceMappingURL=ingredients.specs.js.map