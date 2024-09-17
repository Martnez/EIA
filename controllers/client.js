const Client = require('../models/client');

const Policy = require('../models/policy');

const Claim = require('../models/claims');

const Logs= require('../models/logs');

const fs = require('fs');

const path = require('path');

exports.getNewClient= (req,res,next) =>{

  const user = req.user;
  const firstName = user.firstName;
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
task: "Created new client",
userId: user._id,
time: current_time,
date:current_date
});
  log.save();
const userName =  "Hello"+ " "  + user.firstName +"!";
    res.render('new-client', {
      userName:userName,
      firstName:firstName,
        pageTitle: 'new-client',
        path: '/new-client',
        isAuthenticated: req.session.isLoggedIn,
        emailError: req.flash('emailError'),
        fileError: req.flash('fileError'),
        
})
};
exports.getClientProfile= (req,res,next) =>{
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";
const firstName =user.firstName

const clientId = req.params.clientId;
Policy.findAll({include:[{model:Client,where:{id:clientId}}]})
.then(policies=>{
  
  res.render('client-profile',{
    userName:userName ,
    firstName:firstName,
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
  const user = req.user;
  const userName =  "Hello"+ " "  + user.firstName +"!";
  const firstName = req.body.firstName;
  const signature = req.body.signature;
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
  // const kraCert= req.files['kraCert'][0];
  // const idCopy = req.files['idCopy'][0];
  // const logBook = req.files['logBook'][0];
  const level = req.body.level;
  // const occupation = req.body.occupation;
  const contactPerson = req.body.contactPerson;
  const contactPersonNumber = req.body.contactPersonNumber;
//    if(!kraCert){
//     req.flash('fileError','Attached file is not an image!');
//     return     res.render('new-client', {
//       userName:userName,
//         pageTitle: 'new-client',
//         path: '/new-client',
//         isAuthenticated: req.session.isLoggedIn,
//         emailError: req.flash('emailError'),
//         fileError: req.flash('fileError'),
        
// });
//    };
//    if(!idCopy){
//     req.flash('fileError','Attached file is not an image!');
//     return res. res.render('new-client', {
//       userName:userName,
//         pageTitle: 'new-client',
//         path: '/new-client',
//         isAuthenticated: req.session.isLoggedIn,
//         emailError: req.flash('emailError'),
//         fileError: req.flash('fileError'),
        
// });
//    };
  //  if(!logBook){
  //   req.flash('fileError','Attached file is not an image!');
  //   return res.redirect('/new-client');
  //  };
  
  Client.findOne({where:{email: email}})
  .then(client => {
    if (client) {
      req.flash('emailError','client with  this email already exist!');
      return res.redirect('/new-client');
    }
  }).then(result=>{
      //  const kraCertPath = kraCert.path;
      //  const idCopyPath = idCopy.path;
      //  const logBookPath = logBook.path;
    const client = new Client({
      email: email,
      phoneNumber:phoneNumber,
      firstName:firstName,
      lastName:lastName,
      signature:signature,
      town: city,
      regNumber:regNumber,
      country:country,
      boxOffice:boxOffice,
      idNumber: idNumber,
      businessType:businessType,
      businessNature:businessNature,
      // kraCert:kraCertPath,
      pin:pin,
      regNumber:regNumber,
      // idCopy:idCopyPath,
      // logBook:logBookPath,
      level:level,
      // occupation:occupation,
      contactPerson: contactPerson,
      contactPersonNumber: contactPersonNumber
  
    });
    return client.save().then(data=>{
      
    });

  }).then(aftersave=>{
    res.redirect('/new-client');
  })
  .catch(err => {
    console.log(err);
  });



};
// exports.getKraCert = (req,res,next)=>{
// const myclientId= req.params.clientId;
// Client.findOne({where:{id :myclientId}}).then(client=>{
//   const kraCertPath = path.join(client.kraCert);
  
//   fs.readFile(kraCertPath,(err,data)=>{
//     if(err){
//       return next (err);
//     }
//     res.setHeader('content-Type','application/image')

//     res.send(data)
//   })
// })

// };
exports.getPolicyEdit=(req,res,next)=>{
  const policyId =req.params.policyId;
  console.log(policyId);
  const user = req.user;
  let today = new Date()
  let month = today.getMonth() + 1;
  let date= today.getDate();
  let year = today.getFullYear();
  let hour = today.getHours();
  let min = today.getMinutes();
  let secs = today.getSeconds();
  const current_date = `${year}/${month}/${date}`;
  const current_time = `${hour}:${min}:${secs}`;

const log= new Logs({
task: "Edited a policy",
userId: user._id,
time: current_time,
date:current_date
});
  log.save();
const userName =  "Hello"+ " "  + user.firstName +"!";
  Policy.findOne({raw: true,where:{id:policyId}}).then(
    policy=>{
      
      if(policy.policytype == 'Motor vehicles'){
      res.render('motorEdit',{
        userName:userName ,
        policy:policy,
          pageTitle: 'motor Edits',
          path:'/motorEdit',
          isAuthenticated: req.session.isLoggedIn
      });
      }else{
        console.log('i rendered second');
        res.render('nonMotorEdit',{
          userName:userName ,
          policy:policy,
            pageTitle: 'non-motor-edits',
            path:'/nonMotorEdit',
            isAuthenticated: req.session.isLoggedIn
        });

      }
    }
  ).catch(err=>{
    console.log(err);
  })

};
exports.getPolicyView=(req,res,next)=>{
  const policyId =req.params.policyId;
  console.log(policyId);
  const user = req.user;
  const firstName =user.firstName;
  let today = new Date()
  let month = today.getMonth() + 1;
  let date= today.getDate();
  let year = today.getFullYear();
  let hour = today.getHours();
  let min = today.getMinutes();
  let secs = today.getSeconds();
  const current_date = `${year}/${month}/${date}`;
  const current_time = `${hour}:${min}:${secs}`;

const log= new Logs({
task: "Edited a policy",
userId: user._id,
time: current_time,
date:current_date
});
  log.save();
const userName =  "Hello"+ " "  + user.firstName +"!";
  Policy.findOne({raw: true,where:{id:policyId}}).then(
    policy=>{
      
      if(policy.policytype == 'Motor vehicles'){
      res.render('policy-view-motor',{
        userName:userName ,
        policy:policy,
          pageTitle: 'policy-view-motor',
          path:'/policy-view-motor',
          isAuthenticated: req.session.isLoggedIn
      });
      }else{
        console.log('i rendered second');
        res.render('policy-view-new',{
          userName:userName ,
          policy:policy,
            pageTitle: 'policy-view-new',
            path:'/policy-view-new',
            isAuthenticated: req.session.isLoggedIn
        });

      }
    }
  ).catch(err=>{
    console.log(err);
  })

};
exports.getMotor= (req,res,next) =>{
  const clientId= req.params.clientId;
  const user = req.user;
  const firstName= user.firstName;
  let today = new Date()
  let month = today.getMonth() + 1;
  let date= today.getDate();
  let year = today.getFullYear();
  let hour = today.getHours();
  let min = today.getMinutes();
  let secs = today.getSeconds();
  const current_date = `${year}/${month}/${date}`;
  const current_time = `${hour}:${min}:${secs}`;

const log= new Logs({
task: "created a motor policy",
userId: user._id,
time: current_time,
date:current_date
});
  log.save();
const userName =  "Hello"+ " "  + user.firstName +"!";

res.render('motor-details',{
  userName:userName ,
  firstName:firstName,
    pageTitle: 'motor-details',
    clientId:clientId,
    path:'/motor-details',
    fileError: req.flash('fileError'),
    isAuthenticated: req.session.isLoggedIn
});
 
};
exports.getNonMotor= (req,res,next) =>{
  const clientId= req.params.clientId;
  const user = req.user;
const userName =  "Hello"+ " "  + user.firstName +"!";
const firstName= user.firstName;

  let today = new Date()
  let month = today.getMonth() + 1;
  let date= today.getDate();
  let year = today.getFullYear();
  let hour = today.getHours();
  let min = today.getMinutes();
  let secs = today.getSeconds();
  const current_date = `${year}/${month}/${date}`;
  const current_time = `${hour}:${min}:${secs}`;

const log= new Logs({
task: "created a non motor policy",
userId: user._id,
time: current_time,
date:current_date
});
  log.save();


res.render('non-motor-details',{
  userName:userName ,
  firstName:firstName,
  clientId:clientId,
    pageTitle: 'non-motor-details',
    path:'/non-motor-details',
    isAuthenticated: req.session.isLoggedIn
});
  
};
exports.postMotor= (req,res,next)=>{
  const clientId= req.params.clientId;
  const policytype= 'Motor vehicles';
  let stampDuty =req.body.stampDuty;
  const rate = req.body.rate;
  console.log(rate);
  const otherName = req.body.otherName;
  const signature = req.body.signature;
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
  const exPro = req.body.exPro;
  const poliTe = req.body.poliTe;
  const perAcc= req.body.perAcc;
  const otherBe = req.body.otherBe;
  let newStampDuty = (stampDuty-0) || 0;
  let NewRate = (rate-0) || 1;
  let newSumInsured= (sumInsured-0) || 0;
  console.log(newSumInsured);
  let newExPro =(exPro-0) || 0;
  let newPoliTe= (poliTe-0) || 0;
  let newPerAcc= (perAcc-0) || 0;
  let newOtherBe = (otherBe-0) || 0;
  let basicPremium = (newSumInsured *(NewRate/100));
  console.log(basicPremium);
  let subBasic = (basicPremium + newExPro + newPoliTe + newPerAcc + newOtherBe);
  let trainingLevy= (subBasic * 0.002);
  let PHCF = (subBasic * 0.0025);
  
  console.log(subBasic);
  const GrandTotal = (newStampDuty + trainingLevy + PHCF + subBasic);
  console.log(GrandTotal);
  const  policy= new Policy({
    clientId:clientId,
    otherBe:otherBe,
    signature:signature,
    rate:rate,
    otherName:otherName,
    stampDuty: stampDuty,
    netProfit:GrandTotal,
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
    policyNumber: policyNumber,
    policyStart: policyStart,
    policyEnd: policyEnd,
    GrandTotal:GrandTotal,
  });
    policy.save();

res.redirect(`/motor-details/${clientId}`)
  
};
exports.postMotorEdit= (req,res,next)=>{
  const policyId= req.params.policyId;
  const policytype= 'Motor vehicles';
  let stampDuty =req.body.stampDuty;
  const rate = req.body.rate;
  console.log(rate);
  const otherName = req.body.otherName;
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
  const exPro = req.body.exPro;
  const poliTe = req.body.poliTe;
  const perAcc= req.body.perAcc;
  const otherBe = req.body.otherBe;
  let newStampDuty = (stampDuty-0) || 0;
  let NewRate = (rate-0) || 1;
  let newSumInsured= (sumInsured-0) || 0;
  console.log(newSumInsured);
  let newExPro =(exPro-0) || 0;
  let newPoliTe= (poliTe-0) || 0;
  let newPerAcc= (perAcc-0) || 0;
  let newOtherBe = (otherBe-0) || 0;
  let basicPremium = (newSumInsured *(NewRate/100));
  console.log(basicPremium);
  let subBasic = (basicPremium + newExPro + newPoliTe + newPerAcc + newOtherBe);
  let trainingLevy= (subBasic * 0.002);
  let PHCF = (subBasic * 0.0025);
  
  console.log(subBasic);
  const GrandTotal = (newStampDuty + trainingLevy + PHCF + subBasic);
  console.log(GrandTotal);
  Policy.findOne({where:{id:policyId}}).then(policy=>{
   policy.otherBe=otherBe,
   policy.rate=rate,
   policy.otherName=otherName,
   policy.stampDuty= stampDuty,
   policy.netProfit=GrandTotal,
   policy.exPro=exPro,
   policy.poliTe=poliTe,
   policy.perAcc=perAcc,
   policy.policytype= policytype,
   policy.policyName= policyName,
   policy.coverType= coverType,
   policy.branch= branch,
   policy.mvClass= mvClass,
   policy.regN= regN,
   policy.sumInsured= sumInsured,
   policy.insurer= insurer,
   policy.logBookNumber= logBookNumber,
   policy.engineNumber= engineNumber,
   policy.chasisNumber= chasisNumber,
   policy.policyNumber= policyNumber,
   policy.policyStart= policyStart,
   policy.policyEnd= policyEnd,
   policy.GrandTotal=GrandTotal,
    policy.save();

  }).then(result=>{
    res.redirect('/underwriting')
  })
  
    


  
};

exports.postNonMotor= (req,res,next)=>{
  const clientId= req.params.clientId;
  const policytype= 'NonMotor vehicles';
  let stampDuty =req.body.stampDuty;
  let rate = req.body.rate;
  const policyName= req.body.policyName;
  const signature = req.body.signature;
  const otherName = req.body.otherName;
  const coverType = req.body.coverType;
  const branch= req.body.branch;
  const policyNumber= req.body.policyNumber;
  const policyStart= req.body.policyStart;
  const policyEnd = req.body.policyEnd;
  let sumInsured= req.body.sumInsured;
  const insurer =req.body.insurer;
  const employees= req.body.employees;
  const businessNumber= req.body.businessNumber;
  let TPBP = req.body.TPBP;
  let MBP = req.body.MBP;
  let ELBP= req.body.ELBP;
  let PANBP=req.body.PANBP;
  let TPPMBP= req.body.TPPMBP;
  let otherBe=req.body. otherBe;
  let newStampDuty = (stampDuty-0) || 0;
  let NewRate = (rate-0) || 1;
  let newSumInsured=(sumInsured-0) || 0;
  let newTPBP= (TPBP-0) || 0;
  let newMBP = (MBP-0) || 0;
  let newELBP= (ELBP-0) || 0;
  let newPANBP= (PANBP-0) || 0;
  let newTPPMBP= (TPPMBP-0) || 0;
  let newOtherBe = (otherBe-0) || 0;
  let basicPremium = (newSumInsured *(NewRate/100));
  let subBasic = (basicPremium +newOtherBe);
  let trainingLevy= (subBasic * 0.002);
  let PHCF = (subBasic * 0.0025);
  const GrandTotal = (newStampDuty + trainingLevy + PHCF + subBasic + newTPBP + newMBP + newELBP + newPANBP + newTPPMBP);
  const policy= new Policy({
    clientId:clientId,
    otherBe:otherBe,
    signature:signature,
    rate:rate,
    stampDuty: stampDuty,
    otherName:otherName,
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
    policyEnd: policyEnd,
    GrandTotal:GrandTotal,
  });
    policy.save();

res.redirect(`/non-motor-details/${clientId}`)
};
exports.postNonMotorEdit= (req,res,next)=>{
  const policyId= req.params.policyId;
  const policytype= 'NonMotor vehicles';
  let stampDuty =req.body.stampDuty;
  let rate = req.body.rate;
  const policyName= req.body.policyName;
  const otherName = req.body.otherName;
  const coverType = req.body.coverType;
  const branch= req.body.branch;
  const policyNumber= req.body.policyNumber;
  const policyStart= req.body.policyStart;
  const policyEnd = req.body.policyEnd;
  let sumInsured= req.body.sumInsured;
  const insurer =req.body.insurer;
  const employees= req.body.employees;
  const businessNumber= req.body.businessNumber;
  let TPBP = req.body.TPBP;
  let MBP = req.body.MBP;
  let ELBP= req.body.ELBP;
  let PANBP=req.body.PANBP;
  let TPPMBP= req.body.TPPMBP;
  let otherBe=req.body. otherBe;
  let newStampDuty = (stampDuty-0) || 0;
  let NewRate = (rate-0) || 1;
  let newSumInsured=(sumInsured-0) || 0;
  let newTPBP= (TPBP-0) || 0;
  let newMBP = (MBP-0) || 0;
  let newELBP= (ELBP-0) || 0;
  let newPANBP= (PANBP-0) || 0;
  let newTPPMBP= (TPPMBP-0) || 0;
  let newOtherBe = (otherBe-0) || 0;
  let basicPremium = (newSumInsured *(NewRate/100));
  let subBasic = (basicPremium +newOtherBe);
  let trainingLevy= (subBasic * 0.002);
  let PHCF = (subBasic * 0.0025);
  const GrandTotal = (newStampDuty + trainingLevy + PHCF + subBasic + newTPBP + newMBP + newELBP + newPANBP + newTPPMBP);

  Policy.findOne({where:{id:policyId}}).then(policy=>{
    policy.otherBe=otherBe,
    policy.rate=rate,
    policy.stampDuty= stampDuty,
    policy.otherName=otherName,
    policy.employees=employees,
    policy.businessNumber=businessNumber,
    policy.TPBP=TPBP,
    policy.MBP=MBP,
    policy.ELBP=ELBP,
    policy.PANBP=PANBP,
    policy.TPPMBP=TPPMBP,
    policy.policytype= policytype,
    policy.policyName= policyName,
    policy.coverType= coverType,
    policy.branch= branch,
    policy.sumInsured= sumInsured,
    policy.insurer= insurer,
    policy.policyNumber= policyNumber,
    policy.policyStart= policyStart,
    policy.policyEnd= policyEnd,
    policy.GrandTotal=GrandTotal,

    policy.save();

  }).then(result=>{
    res.redirect('/underwriting')
  })
  
    


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
exports.getClaims= (req,res,next) =>{
  const user = req.user;
  const firstName = user.firstName;
const userName =  "Hello"+ " "  + user.firstName +"!";
Claim.findAll({include:[{model:Policy}],limit:10,order: [ [ 'createdAt', 'DESC' ]]}).then(claim=>{
  
  res.render('claims', {
    userName:userName,
    firstName:firstName,
    claims:claim,
      pageTitle: 'claims',
      path: '/claims',
      isAuthenticated: req.session.isLoggedIn,
      
})
 
});

};
exports.getClaimEdit= (req,res,next) =>{
  const user = req.user;
  const claimId = req.params.claimId
const userName =  "Hello"+ " "  + user.firstName +"!";
  Claim.findOne({where:{id:claimId},include:[{model:Policy}]}).then(claim=>{
    
  res.render('singleClaim', {
    userName:userName,
    claims:claim,
      pageTitle: 'claim-edit',
      path: '/singleClaim',
      isAuthenticated: req.session.isLoggedIn,
      
})
 
});

};


exports.getPolicySelection=(req,res,next)=>{
  Policy.findAll({include:[{model:Client}],limit:10,order: [ [ 'createdAt', 'DESC' ]]}).then(policy=>{
    const user = req.user;
  const userName =  "Hello"+ " "  + user.firstName +"!";
  res.render('policy-selection',{
      userName:userName ,
      policies:policy,
      pageTitle: 'policy-selection',
      path:'/policy-selection',
      isAuthenticated: req.session.isLoggedIn
  });
  })
   
}
exports.getNewClaims= (req,res,next) =>{

  const policyId= req.params.policyId
  const user = req.user;
  const firstName = user.firstName;
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
task: "created a new claim",
userId: user._id,
time: current_time,
date:current_date
});
  log.save();
const userName =  "Hello"+ " "  + user.firstName +"!";
 Policy.findOne({where:{id:policyId}})
 .then(policy=>{
  
  res.render('new-claim', {
    userName:userName,
    firstName:firstName,
     singlePolicy:policy,
     policyId:policyId,
      pageTitle: 'new-claim',
      path: '/new-claim',
      isAuthenticated: req.session.isLoggedIn,
     
})
 })
 
};
exports.postClaim=(req,res,next)=>{
  const policyId= req.params.policyId;
  const reportDate = req.body.reportDate;
  const signature = req.body.signature;
  const compensation = req.body.comp;
  const lossDate = req.body.lossDate;
  const claimAmount = req.body.claimAmount;
  const claimType = req.body.claimType;
  const description = req.body.description;
  const offerAmount = req.body.offerAmount;
  const reporter = req.body.reporter;
  const offerDate = req.body.offerDate;
  const compDate = req.body.compDate;
  const reporterContact = req.body.reporterContact;
  const garagedAt = req.body.garagedAt;
  const garageContact = req.body.garageContact;
// Policy.findAll({where:{id:policyId},include:[{model:Client}]}).then(
//   policies=>{
//     const firstName= policies[0].client.firstName;
//     const lastName= policies[0].client.lastName;

//     
//   }
// )
 
  
  
   const claim = new Claim({
     policyId:policyId,
     reportDate:reportDate,
     lossDate:lossDate,
     signature:signature,
     claimAmount: claimAmount,
     claimType: claimType,
     offerAmount: offerAmount,
     reporter:reporter,
     offerDate: offerDate,
     compDate:compDate,
     reporterContact:reporterContact,
     garagedAt:garagedAt,
     compensation: compensation,
     garageContact:garageContact,
     description:description

   })
   claim.save()
   res.redirect('/claims')

};
exports.postClaimEdit=(req,res,next)=>{
  const claimId = req.params.claimId
  const reportDate = req.body.reportDate;
  const compensation = req.body.comp;
  const lossDate = req.body.lossDate;
  const claimAmount = req.body.claimAmount;
  const claimType = req.body.claimType;
  const description = req.body.description;
  const offerAmount = req.body.offerAmount;
  const reporter = req.body.reporter;
  const offerDate = req.body.offerDate;
  const compDate = req.body.compDate;
  const reporterContact = req.body.reporterContact;
  const garagedAt = req.body.garagedAt;
  const garageContact = req.body.garageContact;

  Claim.findOne({where:{id:claimId}}).then(claim=>{
   claim.reportDate=reportDate,
    claim.lossDate=lossDate,
   claim.claimAmount=claimAmount,
    claim.claimType=claimType,
   claim.offerAmount=offerAmount,
    claim.reporter=reporter,
    claim.offerDate= offerDate,
    claim.compDate=compDate,
   claim.reporterContact=reporterContact,
   claim.garagedAt=garagedAt,
    claim.compensation=compensation,
    claim.garageContact=garageContact,
   claim.description=description
  return claim.save()

  }).then(result=>{
    res.redirect('/claims')
  })

    
   

};