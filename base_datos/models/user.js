'use strict';

const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
   
    static associate(models) {
      // define association here
      User.hasMany(models.Task,{
        as: 'tasks',
        foreignKey: 'userId'
      });
    }
  };
  User.init({
    email:{
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
    password_hash: DataTypes.STRING,
    password: DataTypes.VIRTUAL
  }, {
    sequelize,
    modelName: 'User',
  });

  User.login = function(email, password){
    return User.findOne({
  where:{
    email: email
      }    
    }).then(user=>{
      if(!user) return null;
     return user.authenticatePassword(password).then(valid=> valid ? user : null);
    });
  };


  User.prototype.authenticatePassword = function(password){
    return new Promise((res, rej)=>{
      bcrypt.compare(password,this.password_hash,function(err, valid) {
      if(err) return rej(err);

        res(valid);
      
      });
    });
    
  }

  User.beforeCreate(function(user, options) {

    return new Promise((res, rej)=>{
      if(user.password){
        bcrypt.hash(user.password, 10, function(error, hash){
         user.password_hash = hash;
          res();
        });
      }
    });
   
  });
  return User;
};