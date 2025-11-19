const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const productoRoutes = require('../routes/productoRoutes');
const pedidoRoutes = require('../routes/pedidoRoutes');
const datosRoutes = require('../routes/dataRoutes');
const informeRoutes = require('../routes/InformeRoutes');
const usuarioRoutes = require('../routes/UsuarioRoutes');
const authRoutes = require('../routes/authRoutes');
const cajaRoutes = require('../routes/cajaRoutes');

const clientesRoutes = require('../routes/clientesRoutes');
const { fileURLToPath } = require('url');
const methodOverride = require('method-override');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static('public'));

app.use(
  session({
    secret: 'saborurbano_secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());

// ROUTES
app.use('/', authRoutes);
app.use('/productos', productoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/clientes', clientesRoutes);
app.use('/datos', datosRoutes);
app.use('/informe', informeRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/caja', cajaRoutes);


app.get('/', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  return res.redirect('/inicio');
});



app.get('/inicio', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }

  res.render('index', {
    usuario: req.session.usuario,
    rol: req.session.rol,
  });
});

module.exports = app;
