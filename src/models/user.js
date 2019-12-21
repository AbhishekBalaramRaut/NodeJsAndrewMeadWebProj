const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength:7
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength:7
    },
    age: {
        type: Number,
        default:0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be apositive number');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is incorrect');
            }
        }
    },
    tokens : [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps:true
});

userSchema.methods.toJSON =  function () {
    const user = this;
    const userObject = user.toObject();
    if(userObject['role'] != 'admin') {
        delete userObject.role;
    }
    delete userObject.password;
    delete userObject.tokens;
 
   return userObject;
};

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken =  async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET,{ expiresIn: '1 day'});
    user.tokens = user.tokens.concat({token});

    await user.save()
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user  = await User.findOne({ email });

    if(!user) {
        throw new Error('Email or Password is not registered');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch) {
        throw new Error('Email or Password is incorrect');
    }

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    console.log('middleware save user called');
    if(user.isModified('password')) {
        console.log('password modified');
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;
    console.log('middleware remove user called');
    await Task.deleteMany({owner: user._id});
    next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;