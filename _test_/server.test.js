
'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
const users = require('../src/models/user');
const UsersSchema = require('../usersSchema');

const sequelize = new Sequelize('postgres://postgres@localhost:5432/testdb');

const Users = users(sequelize, DataTypes);

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.drop();
});

describe('Bearer Auth', () => {
    let userInfo = {
        username: 'Tareq',
        password: '123'
    }

    it('should create a user with a hashed password', async () => {
        // arrange

        // act
        let user = await Users.create(userInfo);
        
        let isValid = await bcrypt.compare(userInfo.password, user.password);

        // assert
        expect(user.id).toBeTruthy();
        //check user name and password
        expect(isValid).toBeTruthy();
    });

    it('should attach a teken on find', async () => {
        //arrange 

        //act
        let user = await Users.findOne({ username: userInfo.username});
        let decodedJwt = jwt.decode(user.token);

        // assert
        expect(user.username).toEqual(userInfo.username);
        expect(user.token).toBeTruthy();
        expect(decodedJwt.username).toEqual(userInfo.username);
    });
});
