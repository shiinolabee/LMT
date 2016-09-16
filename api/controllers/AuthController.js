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
        return res.json(401, {err: 'System didn\'t recognize your log-in details'});

      }       

      console.log(password, user);

      User.comparePasswordIfValid(password, user, function(err, valid) {
       
        if (err) {
          return res.json(403, {err: 'Incorrect log-in details' });
        }

        if (!valid) {
          return res.json(401, {err: 'Invalid email/password.'});
        } else {
          res.json({user: user, token: jwToken.issue({id : user.id })});
        }
      });

    })
  },

  register: function(req, res) {

    var data = req.param('data');

    if (data.password !== data.confirmPassword) {
      return res.json(401, { success : false, err: 'Password doesn\'t match'});
    }

    User.create(data).exec(function(err, user) {

      if (err) {     
        return res.json(err.status,{ success :false, err: "Error" });        
      }

      if (user) {
        res.json(200,{ user: user, token: jwToken.issue({id: user.id}) });
      }
    });

  }
};
