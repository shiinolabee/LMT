/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  authenticate: function(req, res) {
    
    var email = req.param('email');
    var password = req.param('password');   

    if (!email || !password) {
      return res.json(401, {err: 'Email and password is required.'});
    }

    User.findOne({ where : { email : email } }).then(function(user) {      

      if (!user) {
        sails.log("User attempting to login failed. System didn\'t recognize your log-in details");
        return res.json(401, {err: 'System didn\'t recognize your log-in details'});

      }       

      sails.log("User attempting to login using email: ",email);
      sails.log("User attempting to login using password: ",password);

      User.comparePasswordIfValid(password, user, function(err, valid) {
       
        if (err) {
          sails.log("User attempting to login failed. Incorrect log-in details");
          return res.json(401, {err: 'Incorrect log-in details' });
        }

        if (!valid) {
          sails.log("User attempting to login failed. Invalid email/password.");          
          return res.json(401, {err: 'Invalid email/password.'});
        } else {
          sails.log("User attempting to login successful."); 
          res.json({user: user, token: jwToken.issue({id : user.id })});
        }
      });

    })
  },

  register: function(req, res) {

    var data = req.param('data');

    if (data.password !== data.confirmPassword) {
      sails.log("Provided password doesn\'t match."); 
      return res.json(401,{ success : false, err: 'Password doesn\'t match'});
    }

    User.create(data).exec(function(err, user) {

      if (err) {
        sails.log("Error registering your details.");      
        return res.json(401,{ success :false, err: "Error registering your details" });        
      }

      if (user) {
        sails.log("User details successfully registered."); 
        res.json(200,{ user: user, token: jwToken.issue({id: user.id}) });
      }
    });

  }
};
