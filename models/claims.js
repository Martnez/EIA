
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const claims = sequelize.define('claim', {
   id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  claimType:{
    type: Sequelize.STRING,
    allowNull:false
  },

  reportDate:{
    type:Sequelize.DATEONLY,
    allowNull:false,
    
  },
  lossDate:{
    type:Sequelize.DATEONLY,
    allowNull:false,
    
  },
  offerDate:{
    type:Sequelize.DATEONLY,
    allowNull:false,
    
  },
  compDate:{
    type:Sequelize.DATEONLY,
    allowNull:false,
    
  },
  claimAmount:{
      type:Sequelize.INTEGER,
      allowNull:false,
      defaultValue: '0'
  },
  offerAmount:{
    type:Sequelize.INTEGER,
    allowNull:false,
    defaultValue: '0'
},
garagedAt:{
    type: Sequelize.STRING,
    allowNull:false
  },
  reporter:{
    type: Sequelize.STRING,
    allowNull:false
  },
  compensation:{
    type:Sequelize.STRING,
    allowNull:true,
    
},
reporterContact:{
    type: Sequelize.STRING,
    allowNull:false
  },
  garageContact:{
    type: Sequelize.STRING,
    allowNull:false
  },
  description:{
    type: Sequelize.STRING,
    allowNull:false
  },
  signature:{
    type: Sequelize.STRING,
    allowNull:true
  },

 
  
});

module.exports = claims;
