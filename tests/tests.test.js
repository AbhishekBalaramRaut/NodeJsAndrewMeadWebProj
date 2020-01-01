const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
    setupDatabase,
    userId,
    userSave,
    userIdTwo,
    userSaveTwo,
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('should create atask for user', async () => {
    const response = await request(app).post('/tasks')
    .set('Authorization', `Bearer ${userSave.tokens[0].token}`)    
    .send({
        description: 'This is userSave task'
    }).expect(201);
    
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completion).toBe(false);
});

test('should  get all tasks for a user', async () => {
    const response = await request(app).get('/tasks')
    .set('Authorization', `Bearer ${userSave.tokens[0].token}`)    
    .expect(200);

    expect(response.body.length).toBe(2);
});

test('should fetch only completed task', async () => {
    const response = await request(app).get('/tasks?completion=true')
    .set('Authorization', `Bearer ${userSave.tokens[0].token}`)    
    .expect(200);

    expect(response.body.length).toBe(1);
});

test('should  NOT DELETE other users taks', async () => {
    const response = await request(app).delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userSave.tokens[0].token}`)    
    .expect(404);

    const task = await Task.findById(taskThree._id);
    expect(task).not.toBeNull();
});