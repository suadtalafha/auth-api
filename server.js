'usen strict';

const express=require('express');
const app=express();
const notfoundHandelar=require('./src/error-handlers/404');
const errorHandelar=require('./src/error-handlers/500');
const cors = require('cors');
const acl=require('./src/middleware/acl');
const basicAuth=require('./src/middleware/basic-auth');
const bearerAuth=require('./src/middleware/bearer-auth')
const model=require('./src/models/index');
const model2=require('./src/models/user')

app.use(express.json());


app.post('/signup', (req, res) => {
    // check if user name exists
    console.log(req.body);
    Users.create(req.body)
        .then(user => res.status(201).send(user))
        .catch(err => res.status(400).send(err))
});

app.post('/signin', basicAuth(Users), (req, res) => {
    // the user will have the user info and the token
    res.status(200).send(req.user);
});

app.get('/user', bearerAuth(Users), acl('read'), (req, res) => {
    res.status(200).send(req.user);
});

app.post('/create', bearerAuth(Users), acl('create'), (req, res) => {
    res.status(200).send('Ok! I have create permissions');
});

app.put('/update', bearerAuth(Users), acl('update'), (req, res) => {
    res.status(200).send('Ok! I have update permissions');
});

app.delete('/delete', bearerAuth(Users), acl('delete'), (req, res) => {
    res.status(200).send('Ok! I have delete permissions');
});









app.use('*',notfoundHandelar);
app.use(errorHandelar);

module.exports = {
     app,
    start: (PORT) => {
      app.listen(PORT, () => {
        console.log(`Server is lidstening on ${PORT}`);
      });
    },
  };