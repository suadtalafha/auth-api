'use srtrict';
const POSTGRES_URI=process.env.POSTEGER_URI ||"postgres://localhost:5432/user11";

const { Sequelize, DataTypes } = require('sequelize');

var sequelize=new Sequelize(POSTGRES_URI,{});
const users=require('./user');

module.exports={
    db:sequelize,
    User:users(Sequelize, DataTypes)
}
