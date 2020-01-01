const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userId =  new mongoose.Types.ObjectId();
const userSave = {
    _id: userId,
    name: 'Abhishek Raut',
    email: 'abhirait874@gmail.com',
    password:'1234567',
    role: 'user',
    tokens: [{
        token: jwt.sign({_id: userId}, process.env.JWT_SECRET)
    }]
};

const userIdTwo =  new mongoose.Types.ObjectId();
const userSaveTwo = {
    _id: userIdTwo,
    name: 'Prasad Raut',
    email: 'prasadrait874@gmail.com',
    password:'1234567',
    role: 'user',
    tokens: [{
        token: jwt.sign({_id: userIdTwo }, process.env.JWT_SECRET)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First Task',
    completion: false,
    owner: userSave._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second Task',
    completion: true,
    owner: userSave._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third Task',
    completion: false,
    owner: userSaveTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany(); 
    await Task.deleteMany();
    await new User(userSave).save();
    await new User(userSaveTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
    
}

module.exports = {
    setupDatabase,
    userId,
    userSave,
    userIdTwo,
    userSaveTwo,
    taskOne,
    taskTwo,
    taskThree
}; 