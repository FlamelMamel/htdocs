
const btn = document.getElementById('add');

function addUser(){
     console.log('click');
     $('.table').append(
          `<td>#</td>
          <td style="display: none"><input type="text" name="id" placeholder="Enter a name"></td>
          <td><input type="text" name="name" placeholder="Enter a name"></td>
          <td><input type="text" name="surname" placeholder="Enter a surname"></td>
          <td><input type="text" name="username" placeholder="Enter a username"></td>
          <td><input type="text" name="email" placeholder="Enter a email"></td>
          <td><input type="text" name="password" placeholder="Enter a password"></td>
          <td><input type="text" name="city" placeholder="Enter a city"></td>
          <td><input type="submit" value="Create a user" class="change"></td></form>
          <td style="border: 0"></td>`
     );
};

btn.addEventListener('click', function(){
     addUser();
});

let mongodb = require('mongodb');
let express = require('express');
let path = require('path');
let app = express();

let mongoClient = new mongodb.MongoClient('mongodb://localhost:27017/', { // localhost connection
useUnifiedTopology: true
}); 

app.post('/signup', urlencodedParser, function (req, res){
     let nameInput = req.body.name;
     let emailInput = req.body.email;
     let passwordInput = req.body.password;
     let cityInput = req.body.city;
     const now = Date.now(); //current date
     mongoClient.connect(async function(error, mongo) {
          if (!error) {
               let db = mongo.db('Name');  // database connect
               let coll = db.collection('users'); //collection name
               await coll.insertMany([{name: nameInput, email: emailInput, 
                password: passwordInput, city: cityInput, date: now  //add date to db
            }]);
          } else {
               console.error(err);
          }
     });
 });

app.post('/signin', urlencodedParser, function (req, res){
     let emailInput = req.body.email;
     let passwordInput = req.body.password;
     if(emailInput == 'admin@gmail.com' && passwordInput == 'password')
     {
         res.redirect('/admin/name');
     }
     else{
         mongoClient.connect(async function(error, mongo) {
             if (!error) {
                let db = mongo.db('Name');  // database connect
                let coll = db.collection('users'); //collection name
                let check = await coll.find({$and: [{email: emailInput}, {password: passwordInput}]}).toArray();
                res.cookie('email', emailInput);
                res.cookie('password', passwordInput);
           } else {
                console.error(err);
           }
         });
     }
 });

 
 function addUser(){
      console.log('click');
      $('.last').replaceWith(
           `<tr class="line">
                <form action="/create" method="post">
                     <td>#</td>
                     <td><input type="text" name="namecreate" placeholder="Enter a name"></td>
                     <td><input type="text" name="emailcreate" placeholder="Enter a email"></td>
                     <td><input type="text" name="passwordcreate" placeholder="Enter a password"></td>
                     <td><input type="text" name="citycreate" placeholder="Enter a city"></td>
                     <td><input type="submit" value="Create a user" class="change"></td>
                     <td></td>
                </form>
           </tr>`
      );
 };
 
 btn.addEventListener('click', function(){
      addUser();
 });










 
app.get('/myprofile', function (req, res){
     let cookies = new Cookies(req, res);
     let username = cookies.get('username');
     let password = cookies.get('password');
     mongoClient.connect(async function(error, mongo) {
         if (!error) {
             let db = mongo.db('bookmart');
             let coll = db.collection('users');
             let check = await coll.find({$and: [{username: username}, {password: password}]}).toArray();
             let data = {
                 name: check[0].name,
                 surname: check[0].surname,
                 username: check[0].username,
                 email: check[0].email,
                 password: check[0].password
             }
             res.render('myprofile', {data: data});
         } else {
             console.error(err);
         }
     });
 });
 
 app.post('/myprofile', urlencodedParser, function(req, res){
     let nameInput = req.body.name;
     let surnameInput = req.body.surname;
     let usernameInput = req.body.username;
     let emailInput = req.body.email;
     let passwordInput = req.body.password;
     let cookies = new Cookies(req, res);
     let username = cookies.get('username'); //this cookie saved after authorization
     mongoClient.connect(async function(error, mongo) {
         if (!error) {
             let db = mongo.db('bookmart');
             let coll = db.collection('users');
             await coll.updateOne({username: username}, {$set: {name: nameInput, surname: surnameInput, username: usernameInput, email: emailInput, password: passwordInput}});
             let data = {
                 name: nameInput,
                 surname: surnameInput,
                 username: usernameInput,
                 email: emailInput,
                 password: passwordInput
             }
             res.render('myprofile', {data: data});
         } else {
             console.error(err);
         }
     });
     res.cookie('username', usernameInput);
 });
 let ObjectID = require('mongodb').ObjectID;
 
 app.post('/delete', urlencodedParser, function(req, res){
     let index = req.body.index;
     mongoClient.connect(async function(error, mongo) {
         if (!error) {
             let db = mongo.db('bookmart');
             let coll = db.collection('users');
             await coll.deleteOne({"_id": ObjectID(index)});
         } else {
             console.error(err);
         }
     }); 
     res.redirect('/admin/name');
 });
 
 app.post('/create', urlencodedParser, function(req, res){
     let nameInput = req.body.namecreate;
     let emailInput = req.body.emailcreate;
     let passwordInput = req.body.passwordcreate;
     let cityInput = req.body.citycreate;
     let lastInput = req.body.lastcreate;

     mongoClient.connect(async function(error, mongo) {
         if (!error) {
             let db = mongo.db('bookmart');
             let coll = db.collection('users');
             await coll.insertMany([{name: nameInput, email: emailInput, password: passwordInput, city: cityInput, data: lastInput}]);
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
                 let db = mongo.db('bookmart');
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
     else if(req.params.id == 'surname')
     {
         mongoClient.connect(async function(error, mongo) {
             if (!error) {
                 let db = mongo.db('bookmart');
                 let coll = db.collection('users');
                 let data = await coll.find().sort({surname: 1}).toArray();
                 let sort = {
                     by: 'surname'
                 }
                 res.render('admin', {data: data, sort: sort});
             } else {
                 console.error(err);
             }
         }); 
     }
     else if(req.params.id == 'username')
     {
         mongoClient.connect(async function(error, mongo) {
             if (!error) {
                 let db = mongo.db('bookmart');
                 let coll = db.collection('users');
                 let data = await coll.find().sort({username: 1}).toArray();
                 let sort = {
                     by: 'username'
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
                 let db = mongo.db('bookmart');
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
                 let db = mongo.db('bookmart');
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
 });
 
 
 app.post('/admin', urlencodedParser, function(req, res){
     let nameInput = req.body.name;
     let surnameInput = req.body.surname;
     let usernameInput = req.body.username;
     let emailInput = req.body.email;
     let passwordInput = req.body.password;
     let idInput = req.body.id;
     mongoClient.connect(async function(error, mongo) {
         if (!error) {
             let db = mongo.db('bookmart');
             let coll = db.collection('users');
             await coll.updateOne({"_id": ObjectID(idInput)}, {$set: {name: nameInput, surname: surnameInput, username: usernameInput, email: emailInput, password: passwordInput}});
         } else {
             console.error(err);
         }
     });
     res.redirect('/admin/name');
 });
 
 app.listen(3000, function() {
     console.log('The web site is running!');
 });






 app.get('/admin/:id', function(req, res){
    if(req.params.id == 'name')
    {
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('Name');  // database connect
                let coll = db.collection('users'); //collection name
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

    else if(req.params.id == 'city')
    {
        mongoClient.connect(async function(error, mongo) {
            if (!error) {
                let db = mongo.db('Name');  // database connect
                let coll = db.collection('users'); //collection name
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



});

app.post('/delete', urlencodedParser, function(req, res){
    let index = req.body.index;
    mongoClient.connect(async function(error, mongo) {
        if (!error) {
            let db = mongo.db('Name');  // database connect
            let coll = db.collection('users'); //collection name
            await coll.deleteOne({"_id": ObjectID(index)});
        } else {
            console.error(err);
        }
    }); 
    res.redirect('/admin/name');
});