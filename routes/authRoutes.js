const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { logout } = require('../controllers/AuthController');

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).render('login', { error: info ? info.message : 'Error de autenticación' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET || 'your_default_secret', { expiresIn: '1h' });
      
      res.cookie('jwt', token, { httpOnly: true, secure: false }); // secure: true en producción
      
      switch (user.rol) {
        case 'Admin':
          return res.redirect('/informe');
        case 'Caja':
          return res.redirect('/pagos');
        case 'Cocina':
          return res.redirect('/pedidos');
        default:
          return res.redirect('/inicio');
      }
    });
  })(req, res, next);
});

router.post('/logout', logout);

module.exports = router;
