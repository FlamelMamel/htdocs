const mongodb = require('mongodb');
const mongoClient = new mongodb.MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true
});
const Cookies = require('cookies');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const port = process.env.PORT || 8080;
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('views'));
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'style.css'));
});

app.get('/register', function(req, res){
    res.sendFile(path.join(__dirname, '/', 'register.html'));
});

app.post('/newuser', urlencodedParser, function(req, res){
    mongoClient.connect(async function(error, mongo) {
        if (!error) {
            let db = mongo.db('candyshop');
            let coll = db.collection('users');
            await coll.insertMany([{name: req.body.name, email: req.body.email, password: req.body.password, city: req.body.city, lastvisit: new Date()}]);
        } else {
            console.error(err);
        }
    });
    res.redirect('/register');
});

app.post('/checkuser', urlencodedParser, function(req, res){
    if(req.body.email1 == 'admin@gmail.com' && req.body.pass1 == 'password'){
        res.redirect('/admin/name');
    }else{
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('candyshop');
                let coll = db.collection('users');
                let data = await coll.find({$and: [{email: req.body.email1}, {password: req.body.pass1}]}).toArray();
                if(data.length > 0){
                    res.cookie('name', data[0].name);
                    res.redirect('/');
                }
                else{
                    res.send('<h1>Unfortunately, we could not find a user with such data</h1><br><a href="/register">Back</a>');
                }
            } else {
                console.error(err);
            }
        });
    }
});

let ObjectID = require('mongodb').ObjectID;

app.post('/delete', urlencodedParser, function(req, res){
    let index = req.body.index;
    mongoClient.connect(async function(error, mongo) {
        if (!error) {
            let db = mongo.db('candyshop');
            let coll = db.collection('users');
            await coll.deleteOne({"_id": ObjectID(index)});
        } else {
            console.error(err);
        }
    }); 
    res.redirect('/admin/name');
});

app.post('/create', urlencodedParser, function(req, res){
    mongoClient.connect(async function(error, mongo) {
        if (!error) {
            let db = mongo.db('candyshop');
            let coll = db.collection('users');
            await coll.insertMany([{name: req.body.namecreate, email: req.body.emailcreate, password: req.body.passwordcreate, city: req.body.citycreate, lastvisit: new Date()}]);
        } else {
            console.error(err);
        }
    }); 
    res.redirect('/admin/name');
});

app.get('/admin/:id', function(req, res){
    if(req.params.id == 'name')
    {
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('candyshop');
                let coll = db.collection('users');
                let data = await coll.find().sort({name:1}).toArray();
                let sort = {
                    by: 'name'
                }
                res.render('admin', {data: data, sort: sort});
            } else {
                console.error(err);
            }
        }); 
    }
    else if(req.params.id == 'email')
    {
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('candyshop');
                let coll = db.collection('users');
                let data = await coll.find().sort({email: 1}).toArray();
                let sort = {
                    by: 'email'
                }
                res.render('admin', {data: data, sort: sort});
            } else {
                console.error(err);
            }
        }); 
    }
    else if(req.params.id == 'password')
    {
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('candyshop');
                let coll = db.collection('users');
                let data = await coll.find().sort({password: 1}).toArray();
                let sort = {
                    by: 'password'
                }
                res.render('admin', {data: data, sort: sort});
            } else {
                console.error(err);
            }
        }); 
    }
    else if(req.params.id == 'city')
    {
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('candyshop');
                let coll = db.collection('users');
                let data = await coll.find().sort({city: 1}).toArray();
                let sort = {
                    by: 'city'
                }
                res.render('admin', {data: data, sort: sort});
            } else {
                console.error(err);
            }
        }); 
    }
    else if(req.params.id == 'date')
    {
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('candyshop');
                let coll = db.collection('users');
                let data = await coll.find().sort({lastvisit: 1}).toArray();
                let sort = {
                    by: 'last visit'
                }
                res.render('admin', {data: data, sort: sort});
            } else {
                console.error(err);
            }
        }); 
    }
});

app.post('/changeuser', urlencodedParser, function(req, res){
    mongoClient.connect(async function(error, mongo) {
        if (!error) {
            let db = mongo.db('candyshop');
            let coll = db.collection('users');
            await coll.updateOne({"_id": ObjectID(req.body.id)}, {$set: {name: req.body.name, email: req.body.email, password: req.body.password, city: req.body.city}});
        } else {
            console.error(err);
        }
    });
    res.redirect('/admin/name');
});


app.listen(port);