const Client = require('../models/client');

const Policy = require('../models/policy');

const fs = require('fs');

const path = require('path');

exports.getNewClient= (req,res,next) =>{
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";
    res.render('new-client', {
      userName:userName,
        pageTitle: 'new-client',
        path: '/new-client',
        isAuthenticated: req.session.isLoggedIn,
        emailError: req.flash('emailError'),
        fileError: req.flash('fileError')
})
};
exports.getClientProfile= (req,res,next) =>{
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";

const clientId = req.params.clientId;
Policy.findAll({include:[{model:Client,where:{id:clientId}}]})
.then(policies=>{
  console.log(policies);
  res.render('client-profile',{
    userName:userName ,
      pageTitle: 'client-profile',
      path:'/client-profile',
      clientId:clientId,
      policies: policies,
      updateSuccess: req.flash('updateSuccess'),
      resetSuccess: req.flash('resetSuccess'),
      isAuthenticated: req.session.isLoggedIn
  });
}).catch(err=>{console.log(err);})

};
exports.postClient=(req,res,next)=>{
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phoneNumber= req.body.phoneNumber;
  const city= req.body.city;
  const country= req.body.country;
  const boxOffice= req.body.boxOffice;
  const email = req.body.email;
  const idNumber= req.body.idNumber;
  const businessType= req.body.businessType;
  const businessNature = req.body.businessNature;
  const pin = req.body.pin;
  const regNumber=  "EIA/CP/08/2021";
  const kraCert= req.file;
  const idCopy = req.file;
  const level = req.body.level;
  const occupation = req.body.occupation;
  const contactPerson = req.body.contactPerson;
  const contactPersonNumber = req.body.contactPersonNumber;
  console.log(kraCert + idCopy);
   if(!kraCert){
    req.flash('fileError','Attached file is not an image!');
    return res.redirect('/new-client');
   };
   if(!idCopy){
    req.flash('fileError','Attached file is not an image!');
    return res.redirect('/new-client');
   };
  
  Client.findOne({where:{email: email}})
  .then(client => {
    if (client) {
      req.flash('emailError','client with  this email already exist!');
      return res.redirect('/new-client');
    }
  }).then(result=>{
       const kraCertPath =kraCert.path;
       const idCopyPath = idCopy.path;
    const client = new Client({
      email: email,
      phoneNumber:phoneNumber,
      firstName:firstName,
      lastName:lastName,
      town: city,
      regNumber:regNumber,
      country:country,
      boxOffice:boxOffice,
      idNumber: idNumber,
      businessType:businessType,
      businessNature:businessNature,
      kraCert:kraCertPath,
      pin:pin,
      regNumber:regNumber,
      idCopy:idCopyPath,
      level:level,
      occupation:occupation,
      contactPerson: contactPerson,
      contactPersonNumber: contactPersonNumber
  
    });
    return client.save();

  }).then(aftersave=>{
    res.redirect('/new-client');
  })
  .catch(err => {
    console.log(err);
  });



};
exports.getKraCert = (req,res,next)=>{
const myclientId= req.params.myclientId;
Client.findOne({where:{id :myclientId}}).then(client=>{
  const kraCertPath = path.join('images',client.kraCert);
  fs.readFile(kraCertPath,(err,data)=>{
    if(err){
      return next (err);
    }
    res.setHeader('content-Type','application/image')
    res.send(data);
  })
})

};
exports.getMotor= (req,res,next) =>{
  const clientId= req.params.clientId;
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";

res.render('motor-details',{
  userName:userName ,
    pageTitle: 'motor-details',
    clientId:clientId,
    path:'/motor-details',
    isAuthenticated: req.session.isLoggedIn
});
 
};
exports.getNonMotor= (req,res,next) =>{
  const clientId= req.params.clientId;
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";

res.render('non-motor-details',{
  userName:userName ,
  clientId:clientId,
    pageTitle: 'non-motor-details',
    path:'/non-motor-details',
    isAuthenticated: req.session.isLoggedIn
});
  
};
exports.postMotor= (req,res,next)=>{
  const clientId= req.params.clientId;
  const policytype= 'Motor vehicles'
  const policyName= req.body.policyName;
  const coverType = req.body.coverType;
  const branch= req.body.branch;
  const policyNumber= req.body.policyNumber;
  const mvClass = req.body.mvClass;
  const policyStart= req.body.policyStart;
  const policyEnd = req.body.policyEnd;
  const regN=req.body.regN;
  const sumInsured= req.body.sumInsured;
  const insurer =req.body.insurer;
  const logBookNumber= req.body.logBookNumber;
  const engineNumber = req.body.engineNumber;
  const chasisNumber = req.body.chasisNumber;
  // const logBookScanned= req.body.logBookScanned;
  const exPro = req.body.exPro;
  const poliTe = req.body.poliTe;
  const perAcc= req.body.perAcc;
  const otherBe = req.body.otherBe

  const  policy= new Policy({
    clientId:clientId,
    otherBe:otherBe,
    exPro:exPro,
    poliTe:poliTe,
    perAcc:perAcc,
    policytype: policytype,
    policyName: policyName,
    coverType: coverType,
    branch: branch,
    mvClass: mvClass,
    regN: regN,
    sumInsured: sumInsured,
    insurer: insurer,
    logBookNumber: logBookNumber,
    engineNumber: engineNumber,
    chasisNumber: chasisNumber,
    // logBookScanned: logBookScanned,
    policyNumber: policyNumber,
    policyStart: policyStart,
    policyEnd: policyEnd
  });
    policy.save();

res.redirect(`/motor-details/${clientId}`)
  
};
exports.postNonMotor= (req,res,next)=>{
  const clientId= req.params.clientId;
  const policytype= 'NonMotor vehicles'
  const policyName= req.body.policyName;
  const coverType = req.body.coverType;
  const branch= req.body.branch;
  const policyNumber= req.body.policyNumber;
  const policyStart= req.body.policyStart;
  const policyEnd = req.body.policyEnd;
  const sumInsured= req.body.sumInsured;
  const insurer =req.body.insurer;
  const employees= req.body.employees;
  const businessNumber= req.body.businessNumber;
  const TPBP = req.body.TPBP;
  const MBP = req.body.MBP;
  const ELBP= req.body.ELBP;
  const PANBP=req.body.PANBP;
  const TPPMBP= req.body.TPPMBP;
  const otherBe=req.body. otherBe
  console.log(policyName);

  const policy= new Policy({
    clientId:clientId,
    otherBe:otherBe,
     employees:employees,
     businessNumber:businessNumber,
     TPBP:TPBP,
     MBP:MBP,
     ELBP:ELBP,
     PANBP:PANBP,
     TPPMBP:TPPMBP,
    policytype: policytype,
    policyName: policyName,
    coverType: coverType,
    branch: branch,
    sumInsured: sumInsured,
    insurer: insurer,
    policyNumber: policyNumber,
    policyStart: policyStart,
    policyEnd: policyEnd
  });
    policy.save();

res.redirect(`/non-motor-details/${clientId}`)
}
exports.getMvDetails= (req,res,next) =>{
  const policyId = req.params.policyId;
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";
Policy.findOne({where:{id:policyId}}).then(
  policy=>{
    res.render('mv-details', {
      userName:userName,
      policy:policy,
        pageTitle: 'mv-details',
        path: '/mv-details',
        isAuthenticated: req.session.isLoggedIn,
       
})
  }
)

};