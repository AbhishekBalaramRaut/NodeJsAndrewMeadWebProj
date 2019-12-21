const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth.js');

const taskRouter  = new express.Router();

taskRouter.post('/tasks', auth, async (req,res) => {
    const task= new Task({
        ...req.body,
        owner: req.user._id 
    });
    
    try {
        await task.save();
        res.status(201).send(task);
    } 
    catch(e) {
        res.status(400).send(e);
    }
});

taskRouter.get('/admin/tasks',auth ,async (req,res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } 
    catch(e) {
        res.status(500).send(e);
    }

});

taskRouter.get('/tasks',auth ,async (req,res) => {
    const match = {};
    const sort = {};
    if(req.query['completion']) {
        match['completion']= req.query['completion'] === 'true';
    }
    if(req.query['sortBy']) {
        const parts= req.query['sortBy'].split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    const pageNo = parseInt(req.query.page) * parseInt(req.query.limit); 
    try {
        await req.user.populate({path : 'tasks',
                                match,
                                options: {
                                    limit: parseInt(req.query.limit),
                                    skip: pageNo,
                                    sort
                                }
                            }).execPopulate();

        res.status(200).send(req.user.tasks);
    } 
    catch(e) {
        res.status(500).send(e);
    }

});

taskRouter.get('/admin/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        const task = await  Task.findById(_id);
        await task.populate('owner').execPopulate();
        if(!task) {
                return res.status(404).send('No task found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

taskRouter.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try {

        const task = await  Task.findOne({owner: req.user._id,_id});
        await task.populate('owner').execPopulate();
        if(!task) {
                return res.status(404).send('No task found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});


taskRouter.patch('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowUpdates = ["description","completion"];
    
    const isValid = updates.every((update) => allowUpdates.includes(update));

    try {

        if(!isValid) {
            return res.status(400).send({error: 'Invalid Updates'}); 
        }
        const task = await  Task.findOne({owner: req.user._id,_id});
        
        if(!task) {
            return res.status(404).send('No task found');
        }
        updates.forEach((update) => task[update] = req.body[update]);
        task.save();

        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

});

taskRouter.patch('/admin/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowUpdates = ["description","completion"];
    
    const isValid = updates.every((update) => allowUpdates.includes(update));

    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        if(!isValid) {
            return res.status(400).send({error: 'Invalid Updates'}); 
        }
        const task = await  Task.findById(_id);
        updates.forEach((update) => task[update] = req.body[update]);
        task.save();

        if(!task) {
                return res.status(404).send('No task found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

});


taskRouter.delete('/admin/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        const task = await  Task.findByIdAndDelete(_id);
        if(!task) {
                return res.status(404).send('No task found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

});

taskRouter.delete('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try {
        const task = await  Task.findOneAndDelete({owner: req.user._id,_id});
        if(!task) {
                return res.status(404).send('No task found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

});


module.exports = taskRouter; 