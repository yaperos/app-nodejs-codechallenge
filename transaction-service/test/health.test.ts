import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;
chai.use(chaiHttp);

describe('Health Check Endpoint', () => {
  it('should return status up', (done) => {
    chai.request('http://localhost:4001') 
      .get('/health')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'up');
        done();
      });
  });
});
