import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomUser } from '../helpers/users_helper.js';

dotenv.config();

const request = supertest(process.env.SUPERTEST_BASE_URL);
const token = process.env.SUPERTEST_USER_TOKEN;
const debug = process.env.SUPERTEST_DEBUG == 1 ? true : false;

/* Remember to use a language here that suits your team's way of working */

describe('/users', () => {
  let userId = null;
  process.env.DEBUG == 1 ? console.log('Debug mode on') : null;  

  it('GET | Should get a list of users', async () => {
    const res = await request.get('/users');
    if (debug) console.log(res.body);
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('array');
    expect(res.body).to.not.be.empty;
  });

  it('GET | Should get male users', async () => {
    const url = `/users?access-token=${token}&gender=male`
    const res = await request.get(url);
    if (debug) console.log(res.body);
    res.body.forEach(user => {
      expect(user.gender).to.eq('male');
    });
    expect(res.status).to.equal(200);
  });

  it('GET | Should get female users', async () => {
    const url = `/users?access-token=${token}&gender=female`
    const res = await request.get(url);
    if (debug) console.log(res.body);
    res.body.forEach(user => {
      expect(user.gender).to.eq('female');
    });
    expect(res.status).to.equal(200);
  });

  it('GET | Should get users with status active', async () => {
    const url = `/users?access-token=${token}&status=active`
    const res = await request.get(url);
    if (debug) console.log(res.body);
    res.body.forEach(user => {
      expect(user.status).to.eq('active');
    });
  });

  it('GET | Should get users with status inactive', async () => {
    const url = `/users?access-token=${token}&status=inactive`
    const res = await request.get(url);
    if (debug) console.log(res.body);
    res.body.forEach(user => {
      expect(user.status).to.eq('inactive');
    });
  });

  it('POST | Should create a new user', async () => {
    const data = createRandomUser();
    const res = await request.post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    if (debug) console.log(res.body);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.include(data);
    userId = res.body.id;
  });

  it('POST | Should not be able to create an empty user | Negative', async () => {
    const data = {};
    const res = await request.post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    if (debug) console.log(res.body);
    expect(res.body[0].message).to.eq('can\'t be blank');
  });

  it('PUT | Should update a user', async () => {
    const data = {
      "name": "Updated from SuperTest"
    };
    const res = await request.put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    if (debug) console.log(res.body);
    expect(res.body.name).to.eq(data.name);
  });

  it('PUT | Should not be able to update a user with an empty name | Negative', async () => {
    const data = {
      "name": ""
    };
    const res = await request.put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    if (debug) console.log(res.body);
    expect(res.body[0].message).to.eq('can\'t be blank');
  });

  it('DELETE | Should delete a user', async () => {
    const res = await request.delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    if (debug) console.log(res.body);
    expect(res.status).to.equal(204);
    expect(res.body).to.be.empty;
  });

  it('DELETE | Should not be able to delete a user that does not exist | Negative', async () => {
    const res = await request.delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    if (debug) console.log(res.body);
    expect(res.status).to.equal(404);
    expect(res.body.message).to.eq('Resource not found');
  });
});