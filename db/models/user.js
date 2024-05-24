"use strict";
const { Model,Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require('bcrypt');
const AppError = require("../../utils/appError");
const project = require("./project");


const user = sequelize.define('user',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('0','1','2'),
    allowNull:false,
    validate:{
      notNull:{
          msg:'UserType cannot be null'
      },
      notEmpty:{
        msg:'UserType cannot be empty'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
          msg:'First name cannot be null'
      },
      notEmpty:{
        msg:'First name cannot be empty'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
          msg:'Last name cannot be null'
      },
      notEmpty:{
        msg:'Last name cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
          msg:'Email cannot be null'
      },
      notEmpty:{
        msg:'Email cannot be empty'
      },
      isEmail:{
        mg:'Invalid email'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
          msg:'Password cannot be null'
      },
      notEmpty:{
        msg:'Password cannot be empty'
      }
    }
  },
  confirmPassword:{
    type:DataTypes.VIRTUAL,
    set(value){
      if(this.password.length < 7){
        throw new AppError('Password lenght must be greater than 7',400)
      }
      if(value === this.password){

        const hashPassword = bcrypt.hashSync(value,10);
        this.setDataValue('password',hashPassword)
      }
      else{
        throw new AppError(
          'Password and confirm password must be the same',400
        )
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt:{
    type:DataTypes.DATE
  }
},{

  paranoid:true,
  freezeTableName:true,
  modelName:'user'
});

user.hasMany(project, {foreignKey:'createdBy'})
project.belongsTo(user, {foreignKey:'createdBy'})

module.exports = user