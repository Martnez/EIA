const User = require('../models/user');

const Logs = require('../models/logs');

const Clients = require('../models/client');

const Policy = require('../models/policy');

const bcrypt= require('bcrypt');

const crypto = require('crypto');

const nodemailer= require('nodemailer');

const {validationResult}= require('express-validator/check')



// const transporter =nodemailer.createTransport({
//   service : 'gmail',
//   auth :{
//     user:'amosdkaranja@gmail.com',
//     pass:'0798230245'
//   },
//   tls: {
//     rejectUnauthorized: false
// }
 
// });

exports.getIndex= (req,res,next) =>{
  
    res.render('index', {
        pageTitle: 'home',
        path: '/',
        isAuthenticated: false,
        linkMessage: req.flash('linkMessage'),
        errorMessage: req.flash('error'),
        successMessage: req.flash('successMessage'),
        resetNull: req.flash('resetNull'),
        oldInputs:{email:'',password:''}
})
};
exports.getHome=(req,res,next)=>{
  const user = req.user;
      const userName =  "Hello"+ " "  + user.firstName +"!";
        res.render('home', {
          userName:userName ,
          pageTitle: 'home',
          path: '/home',
          isAuthenticated: req.session.isLoggedIn,
          
      })
     
};
exports.getSignup= (req,res,next) =>{
    res.render('signup', {
        pageTitle: 'signup',
        path: '/signup',
        isAuthenticated: false
})
};
exports.postCreate=(req,res,next)=>{
  const user= req.user;
   const userName ="Hello" + " " + user.firstName +"!";
    const email = req.body.email;
    const endeavor= "1234"
  const password = endeavor.toString();
  const phoneNumber= req.body.phoneNumber;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    console.log(errors.array());
  return  User.findAll({limit:3,order: [ [ 'createdAt', 'DESC' ]]})
    .then(users=>{
      res.status(422).render('new-user', {
        userName:userName ,
        users: users,
        pageTitle: 'new-user',
        path: '/new-user',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: errors.array()[0].msg
    })
    .catch(err=>{console.log(err)});
   
  })
    
  }
  User.findOne({where:{email: email}})
    .then(user => {
      if (user) {
        req.flash('email-error','username or email already exist!');
        return res.redirect('/new-user');
      }
    return bcrypt.hash(password,12);
    }).then(hashedPassword=>{

      const user = new User({
        email: email,
        password: hashedPassword,
        phoneNumber:phoneNumber,
        firstName:firstName,
        lastName:lastName
      });
      return user.save();

    }).then(aftersave=>{
      res.redirect('/new-user');
    })
    .catch(err => {
      console.log(err);
    });
};
exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    User.findOne({where:{ email: email }})
      .then(user => {
        if (!user) {
    
          return  res.status(422).render('index', {
            pageTitle: 'home',
            path: '/',
            isAuthenticated: false,
            linkMessage: req.flash('linkMessage'),
            errorMessage: req.flash('error'),
            successMessage: req.flash('successMessage'),
            resetNull: req.flash('resetNull'),
            oldInputs:{email:email,password:password}
    });
        }
        bcrypt
          .compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(err => {
                console.log(err);
                let today = new Date()
                let month = today.getMonth() + 1;
                let date= today.getDate();
                let year = today.getFullYear();
                let hour = today.getHours();
                let min = today.getMinutes();
                let secs = today.getSeconds();
                const current_date = `${month}/${date}/${year}`;
                const current_time = `${hour}:${min}:${secs}`;
                console.log(current_date);
                const log= new Logs({
                  task: "logged in",
                  userId: user._id,
                  date:current_date,
                  time:current_time
                  
                })
                    log.save();
                  
                    res.redirect('/home')
               
              });
            }
            req.flash('error','Invalid email or Password!');
            res.redirect('/');
          })
          .catch(err => {
            console.log(err);
            res.redirect('/');
          });
      })
      .catch(err => console.log(err)); 
};
exports.getDashboard=(req,res,next)=>{
  const user = req.user;

      const userName =  "Hello"+ " "  + user.firstName +"!";
      Clients.findAll({order: [ [ 'createdAt', 'DESC' ]]})
      .then(clients=>{
        res.render('dashboard', {
          userName:userName ,
          clients: clients,
          pageTitle: 'dashboard',
          path: '/dashboard',
          isAuthenticated: req.session.isLoggedIn,
          errorMessage: req.flash('email-error')
      })
      .catch(err=>{console.log(err)});
     
    })
};

exports.getUnderwriting= (req,res,next) =>{
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";

Policy.findAll({include:[{model:Clients}],limit:10,order: [ [ 'createdAt', 'DESC' ]]})
.then(policies=>{
  
  res.render('underwriting',{
    userName:userName ,
      pageTitle: 'underwriting',
      path:'/underwriting',
      policies: policies,
      isAuthenticated: req.session.isLoggedIn
  });
}).catch(err=>{console.log(err);})

};

exports.getNewpolicy= (req,res,next)=>{
  const user = req.user
  const userName =  "Hello"+ " "  + user.firstName +"!";
    res.render('new-policy', {
      userName:userName ,
        pageTitle: 'new-policy',
        path: '/new-policy',
        isAuthenticated: req.session.isLoggedIn
})

};

exports.postLogout =(req,res,next)=>{ 
  const user = req.user;
  let today = new Date()
  let month = today.getMonth() + 1;
  let date= today.getDate();
  let year = today.getFullYear();
  let hour = today.getHours();
  let min = today.getMinutes();
  let secs = today.getSeconds();
  const current_date = `${month}/${date}/${year}`;
  const current_time = `${hour}:${min}:${secs}`;
  const log= new Logs({
      task: "logged out",
      userId: user._id,
      time: current_time,
      date:current_date
    });
        log.save();
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    })

  
};
exports.getAdmin = (req,res,next) =>{
  const user = req.user
  const userName =  "Hello"+ " "  + user.firstName +"!";
  res.render('admin', {
    userName:userName ,
    pageTitle: 'admin',
    path: '/admin',
    isAuthenticated: req.session.isLoggedIn
})
};
exports.getNewUser = (req,res,next) =>{
  const user = req.user
  const userName =  "Hello"+ " "  + user.firstName +"!";
  User.findAll({limit:3,order: [ [ 'createdAt', 'DESC' ]]})
  .then(users=>{
    res.render('new-user', {
      userName:userName ,
      users: users,
      pageTitle: 'new-user',
      path: '/new-user',
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: req.flash('email-error')
  })
  .catch(err=>{console.log(err)});
 
})
};
exports.getReset=(req,res,next)=>{
  
  // const userName =  "Hello"+ " "  + user.firstName +"!";
  res.render('reset', {
    pageTitle: 'reset',
    path: '/reset',
    isAuthenticated: false,
    errorMessage: req.flash('resetError')
    

})
};
exports.postReset=(req,res,next)=>{
  const email = req.body.email;
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/');
    }
    const token = buffer.toString('hex')
    User.findOne({where:{email:email}}).then(user=>{
      if (!user) {
                req.flash('resetError','The email you have eneterd does not exist!');
              return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration= Date.now() + 3600000;
            
            const log= new Logs({
              task: "reset",
              userId: user._id
            });
                log.save();
            return user.save();
    })
    .then(result=>{
      res.redirect(`/reset/${token}`);
    })
    .catch(err=>{console.log(err)})
  });
};
exports.getNewpassword=(req,res,next)=>{
  
  const token = req.params.token;
  User.findOne({where:{resetToken: token,}})
  .then(user=>{
    const resetFlag =user.resetFlag;
    console.log(resetFlag);
    if(resetFlag===1){
      req.flash('resetNull','Contact your admin to get a reset password permission!');
      return res.redirect('/')
    }
    res.render('newPassword', {
      pageTitle: 'newPassword',
      path: '/newPassword',
      isAuthenticated: false,
      
      passwordError:req.flash('passwordError'),
      userId : user._id.toString(),
      passwordToken: token
    })
  })
  .catch(err=>{console.log(err)})

    
};
exports.postNewPassword=(req,res,next)=>{
  const newPassword = req.body.password;
  const confirm =  req.body.confirm;
  // const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const errors = validationResult(req);
  let resetUser;
  User.findOne({where:{resetToken:passwordToken}})
  .then(user => {
    if (confirm!=newPassword) {
      req.flash('passwordError','Your passwowrd does not match, refresh and try again');
       return res.redirect(`/reset/${passwordToken}`)
      
    }if(!errors.isEmpty()){
      req.flash('passwordError','Your passwowrd must be 6-8 characters long and it must contain alphanumerics');
       return res.redirect(`/reset/${passwordToken}`)
    }
    resetUser = user;
    return bcrypt.hash(newPassword,12);
  }).then(hashedPassword=>{
    resetUser.password= hashedPassword;
    resetUser.resetToken= null;
    resetUser.resetTokenExpiration =null;
    resetUser.resetFlag = '1'
    return resetUser.save()
  }).then(aftersave=>{
    req.flash('successMessage','You have succesifully changed your password!');
    return res.redirect('/')
  })
  .catch(err => {
    console.log(err);
  });
};
exports.getUserProfile= (req,res,next) =>{
  const user = req.user
  const userName =  "Hello"+ " "  + user.firstName +"!";

const userId = req.params.userId;
// const log= new Logs({
//   task: "new user",
//   userId: userId
// });
    // log.save();
User.findByPk(userId)
.then(user=>{
        if(!user){

          req.flash('fetchError','Unable to get user!');
          return res.redirect('/manage-users')
        }
        res.render('user-profile-view',{
          userName:userName ,
            pageTitle: 'user-profile',
            path:'/user-profile-view',
            user: user,
            updateSuccess: req.flash('updateSuccess'),
            resetSuccess: req.flash('resetSuccess'),
            isAuthenticated: req.session.isLoggedIn
        });
    }
).catch(err=> console.log(err));

};
exports.getManageUsers= (req,res,next) =>{
  const user = req.user
  const userName =  "Hello"+ " "  + user.firstName +"!";
  User.findAll()
  .then(users=>{
    res.render('manage-users', {
      userName:userName ,
      users: users,
      pageTitle: 'manage-users',
      path: '/manage-users',
      fetchError: req.flash('fetchError'),
      isAuthenticated: req.session.isLoggedIn,
})
}).catch(err=>{console.log(err)});

};

exports.postEditUser=(req,res,next)=>{
  const userId = req.body.userId;
    const updatedFirstName = req.body.firstName;
    const updatedLastName = req.body.lastName;
    const updatedEmail = req.body.email;
    const updatedPhoneNumber =  req.body.phoneNumber;
    const updatedUserLevel = req.body.userLevel;
   User.findByPk(userId).then(
       user=>{
           user.firstName= updatedFirstName;
           user.lastName= updatedLastName;
           user.email= updatedEmail;
           user.phoneNumber= updatedPhoneNumber;
           user.userLevel = updatedUserLevel;
           return user.save();
       })
       .then( result=>{
        req.flash('updateSuccess','You succesifully updated', updatedFirstName, updatedLastName);
        res.redirect(`/user-profile-view/${userId}`)
       })
       .catch(err=>console.log(err));

};
exports.postDeleteUser = (req, res, next) => {
  const userId = req.body.userId;
  User.findByPk(userId)
    .then(user => {
      
      return user.destroy();
    })
    .then(result => {
      res.redirect('/manage-users');
    })
    .catch(err => console.log(err));
};
exports.postResetFlag=(req,res,next)=>{
  const userId = req.body.userId;
  User.findByPk(userId)
  .then(user=>{
     user.resetFlag = 0;
     return user.save()
  }).then(result=>{
    req.flash('resetSuccess','Reset succesifully done!');
    res.redirect(`/user-profile-view/${userId}`)
  })
  .catch(err=>console.log(err))

};
exports.getLogs= (req,res,next) =>{
  const user = req.user
  const userName =  "Hello"+ " "  + user.firstName +"!";

  Logs.findAll({include:[{model:User}],limit:10,order: [ [ 'createdAt', 'DESC' ]]})
  
 

  .then(logs=>{
    
    res.render('logs', {
      userName:userName ,
      logs: logs,
      pageTitle: 'logs',
      path: '/logs',
      fetchError: req.flash('fetchError'),
      isAuthenticated: req.session.isLoggedIn
    })
 
}).catch(err=>{console.log(err)});

};
