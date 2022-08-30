const express = require('express');
const path = require("path");

const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
require('dotenv').config();

const ToughtController = require('./controllers/ToughtController');

//Import das rotas
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.set("port", process.env.PORT || 4000);

app.engine('handlebars', exphbs.engine());
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'handlebars');
app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  express.static(path.join(__dirname, "public"))
)

//session middleware
app.use(
  session({
    name: 'session',
    secret: process.env.SECRET_HASH,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: '/tmp'
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true
    }
  }),
)

//flash messages
app.use(flash());

//salvar sessão na resposta
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session
  }
  next();
});

//Rotas
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtController.showToughts);

module.exports = app;