module.exports = {
  ensureAdmin: function(req, res, next) {
        if (req.user && req.user.isAdmin === true) {
          return next();
        } else {
          res.redirect('/users/auth');
        }
  },
  ensureGuest: function(req, res, next) {
    if (req.user && req.user.isGuest === true) {
      return next();
    } else {
      res.redirect('/users/auth');
    }
},
}