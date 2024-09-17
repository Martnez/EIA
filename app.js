const express = require('express');

const bodyParser= require('body-parser');

const path = require('path');

const session = require('express-session');

const flash = require('connect-flash');

const nodemailer = require('nodemailer');

const User = require('./models/user');

const multer =  require('multer')
const Logs = require('./models/logs')

const Client = require('./models/client')

const Policy = require('./models/policy')

const Claims =  require('./models/claims')


const sequelize = require('./util/database');

const  SequelizeStore = require('connect-session-sequelize')(session.Store);

const homeRoutes= require('./routes/home')

const clientRoutes= require('./routes/client');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, file.filename + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'||
      file.mimetype === 'image/pdf'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const app = express();

app.set('view engine','ejs');

app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));

app.use(multer({storage:fileStorage,fileFilter:fileFilter }).
fields([{name:'kraCert',maxCount:1},{name:'idCopy',maxCount:1},{name:'logBook',maxCount:1}]));

// app.use(multer({storage:fileStorage,fileFilter:fileFilter }).single('kraCert'));
// app.use(multer({storage:fileStorage,fileFilter:fileFilter }).single('idCopy'));



app.use(session({
    secret: 'endeavors',
     resave: false, 
     saveUninitialized: false,
     store: new SequelizeStore({db:sequelize,}),
     resave: false,
     proxy:true
    }));
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(homeRoutes);

app.use(clientRoutes);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'images')));

app.use((req,res,next)=>{
    if(!req.session.user){
        return next()
    }
    User.findByPk(req.session.user._id)
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>{console.log(err)});
})

Logs.belongsTo(User,{constraints: true, onDelete:'CASCADE'});
User.hasMany(Logs);
Policy.belongsTo(Client,{constraints: true, onDelete:'CASCADE'});
Client.hasMany(Policy);
Claims.belongsTo(Policy,{constraints: true, onDelete:'CASCADE'});
Policy.hasMany(Claims);
Claims.belongsTo(Client,{constraints: true, onDelete:'CASCADE'});
Client.hasMany(Claims);
sequelize
    // .sync({force: true})
    .sync({ alter: true })
// .sync()

.then( callback=>{
    app.listen(3000,'0.0.0.0') 
})
.catch(
    
    err=>{ console.log(err)
    });
