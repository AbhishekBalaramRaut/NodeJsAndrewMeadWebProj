const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {

    try {
         let token = req.header('Authorization');
         token = token.replace('Bearer ','');
         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
         
         validTokens = [];
         user['tokens'].forEach((ob) => {
             try {
                if(jwt.verify(ob.token,process.env.JWT_SECRET)) {
                    validTokens.push(ob);
                }
             } catch (e) {
                console.log('invaliad token '+ob.token);
             }
            
         });

         user['tokens'] =  validTokens;
         await user.save();
         if(!user) {
             throw new Error();
         }
         req.token = token;
         req.user = user;
         next();

    } catch(e) {
        res.status(401).send({error: 'Please authenticate!'});
    }
};

module.exports = auth;