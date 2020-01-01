const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userId, userSave, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Abhishek Raut B',
        email: 'abhirait874@gmil.com',
        password:'1234567',
        role: 'user'
    }).expect(201);
    
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body.user.name).toBe('Abhishek Raut B');
    //or to check complete object
    expect(response.body).toMatchObject({
        user : {
            name:'Abhishek Raut B',
            email: 'abhirait874@gmil.com'
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('1234567');
});

test('should able to login', async () => {
    const response = await request(app).post('/users/login').send({
        email: userSave.email,
        password: userSave.password
    }).expect(200);

    const user = await User.findById(userId);
    expect(response.body).toMatchObject({
        user : {
            name: userSave.name,
            email: userSave.email
        },
        token: user.tokens[1].token
    });
});

test('should fail the login', async () => {
    await request(app).post('/users/login').send({
        email: 'asdf',
        password: userSave.password
    }).expect(400);
});

test('should get profile for user', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userSave.tokens[0].token}`)
        .send().expect(200);
});

test('should not  get profile for unauthenticated user user', async () => {
    await request(app).get('/users/me')
        .send().expect(401);
});

test('should delete profile for user', async () => {
    
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userSave.tokens[0].token}`)
        .send().expect(200);

            
    const user = await User.findById(userId);
    expect(user).toBeNull();
});

test('should not delete profile for unauthenticated user user', async () => {
    await request(app).delete('/users/me')
        .send().expect(401);
});

test('should upload avatar for user', async () => {
    await request(app).post('/users/me/avatar')
        .set('Authorization', `Bearer ${userSave.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userId);
 
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should fail the login', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userSave.tokens[0].token}`)
    .send({
        age: '15',
        name: 'Vijay Kumar'
    }).expect(200);
    const user = await User.findById(userId);
 
    expect(user.name).toEqual('Vijay Kumar');
});

test('should fail the login', async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userSave.tokens[0].token}`)
    .send({
        location: '15'
    }).expect(400);
});