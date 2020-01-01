const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth.js');
const {welcomeTaskMail,exitTaskMail} = require('./../email/email');

const userRouter  = new express.Router();
userRouter.get('/test', (req,res) => {
  res.send('test successful');
});

const upload = multer({
    limits : {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined,true);
    }
});

const errorMiddleware = (req,res,next) => {
    throw new Error("From my middleware")
}

userRouter.post('/users/me/avatar',auth, upload.single('avatar'),  async (req,res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send(req.user);

},(error,req,res,next) => {
    res.status(400).send({error: error.message});
});

userRouter.delete('/users/me/avatar',auth,  async (req,res) => {
    req.user.avatar = null;
    await req.user.save();
    res.send(req.user);

});

userRouter.post('/users', async (req,res) => {
    const user= new User(req.body);
    
    try {
        await user.save();
      
        const token = await user.generateAuthToken();
        welcomeTaskMail(user.name, user.email);
        res.status(201).send({user,token});
    } 
    catch(e) {
        res.status(400).send(e);
    }

});

userRouter.post('/users/login', async (req,res) => {
    
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user,token});
    } 
    catch(e) {
        if(e['message']) e = e.message;
        res.status(400).send(e);
    }

});

userRouter.post('/users/logout',auth ,async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);

        await req.user.save();

        res.status(200).send("User Logged out!");
    } 
    catch(e) {
        res.status(500).send(e);
    }

});

userRouter.post('/users/logoutAll',auth ,async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.status(200).send("User Logged out!");
    } 
    catch(e) {
        res.status(500).send(e);
    }

});

userRouter.get('/admin/users',auth ,async (req,res) => {
    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        const users = await User.find();
        res.status(200).send(users);
    } 
    catch(e) {
        res.status(500).send(e);
    }

});


userRouter.get('/admin/users/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        const user = await  User.findById(_id);
        if(!user) {
                return res.status(404).send('No user found');
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(e);
    }

});

userRouter.get('/users/me', auth, async (req,res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send(e);
    }

});

userRouter.patch('/admin/users/:id', auth, async (req,res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowUpdates = ["name","email","age","password"];
    
    const isValid = updates.every((update) => allowUpdates.includes(update));

    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        if(!isValid) {
            return res.status(400).send({error: 'Invalid Updates'}); 
        }

        //const user = await  User.findByIdAndUpdate(_id,req.body,{new: true , runValidators: true});
        
        const user = await  User.findById(_id);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        if(!user) {
                return res.status(404).send('No user found');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }

});

userRouter.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name","email","age","password"];
    
    const isValid = updates.every((update) => allowUpdates.includes(update));

    try {

        if(!isValid) {
            return res.status(400).send({error: 'Invalid Updates'}); 
        }

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }

});

userRouter.delete('/admin/users/:id', auth, async (req,res) => {
    const _id = req.params.id;

    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        const user = await  User.findById(_id);
       
        if(!user) {
                return res.status(404).send('No user found');
        }
        await user.remove();
        res.send(user);
    } catch (error) {
        res.status(500).send(e);
    }

});


userRouter.delete('/users/me', auth, async (req,res) => {
    try {
        await req.user.remove();
        exitTaskMail(req.user.name, req.user.email);
        res.send(req.user);
    } catch (error) {
        res.status(500).send(e);
    }

});

userRouter.get('/admin/users/agequery', auth, async (req,res) => {
    let age = req.query.age;
    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        const users = await User.find({age: { $gte: age }});
        res.send(users);
    } 
    catch(e) {
        res.status(500).send(e);
    }

});

userRouter.patch('/admin/users/findAndCount/:id', auth, async (req,res) => {


    try {
        if(req.user['role'] != 'admin') {
            return res.status(401).send('You do not previledge to perform this action');
        }
        const user = await User.findByIdAndUpdate(id,{age: 30});
        if(!user) {
                return res.status(404).send('No user found');
        }
        const count = await User.countDocuments({age:30});
        res.send({count});
    } catch (error) {
        res.status(500).send(e);
    }

});

const add = (a,b) => {
    return new Promise((resolve,reject) => {
         setTimeout(() => {
            console.log('a,b '+a+','+b);

            if(a<1) {
                reject({message: 'Need positive number'});
            }
            resolve(a+b);
         },2000);
    });
}

const addOp = async (a,b) => {
    const sum1  = await add(a,b);
    const sum2 = await add(sum1,b);
    const sum3 = await add(sum2,b);
    return sum3;
}

userRouter.patch('/learning/:id',  (req,res) => {
 
    addOp(0,5).then((count) => {
        res.send({count});
    }).catch((e) => {
        res.status(500).send(e);
    });

});


module.exports = userRouter; 