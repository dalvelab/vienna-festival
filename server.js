const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const exphbs = require('express-handlebars');
const path  = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

// Load Routes
const welcome = require('./routes/welcome');
const user = require('./routes/users');
const program = require('./routes/program');
const admin = require('./routes/admin');
const page = require('./routes/pages');
const albums = require('./routes/albums');
const shop = require('./routes/shop');

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB config
const db = require('./config/keys').mongoURI;

const {listItem} = require('./helpers/hbs');

app.engine('handlebars', exphbs({
  helpers: {
    listItem: listItem
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Method override middleware 
app.use(methodOverride('_method'));

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport Config
require('./config/passport')(passport);

app.use(cookieParser());
app.use(session({
  secret: 'dalvelab',
  resave: false,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session({
  cookie: {maxAhe: 60000}
}));

app.use(flash());

app.use(function(req, res, next)  {
  res.locals.messasges = req.flash();
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next();
});

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes 
app.use('/', welcome);
app.use('/users', user);
app.use('/program', program);
app.use('/admin', admin);
app.use('/page', page);
app.use('/albums', albums);
app.use('/shop', shop);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
