/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

// We don't want to store password with out encryption
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  
  schema: true,
  
  attributes: {

    email: {
      type: 'email',
      required: 'true',
      unique: true // Yes unique one
    },

    fullName : {
    	type : 'string'
    },

    password: {
      type: 'string',
      required : true
    },

    //model validation messages definitions
    // validationMessages: { //hand for i18n & l10n
    //     email: {
    //         required: 'Email is required',
    //         email: 'Provide valid email address',
    //         unique: 'Email address is already taken'
    //     }
    // },
    
    // We don't wan't to send back encrypted password either
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  // Here we encrypt password before creating a User
  beforeCreate : function (values, next) { 
    
    bcrypt.hash(values.password, null, null, function (err, hash) {

      if(err) return next(err);
      
      values.password = hash;

      next();

    }); 

  },

  comparePasswordIfValid : function (password, user, cb) {

    // console.log("User password from DB : ", user.password)
    // console.log("User inputted password : ", password);

    bcrypt.compare(password, user.password, function (err, match) {

      if(err) cb(err);      

      if(match) {
        cb(null, true);
      } else {
        cb(null, false);
      }

    });



  }
};

