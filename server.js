const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middlewares/authorization');

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL || process.env.POSTGRES_URI,
});

// const db = knex({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: true
//     }
//   }
// });

const app = express();

const corsOptions = {
  origin: 'https://smart-brain-app-front.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('combined'));
  app.use(cors());
}else {
  app.use(cors(corsOptions));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  extended: true }));


app.get('/', (req, res) => { res.send('its working') });

app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app is runnin on port ${port}`)
});