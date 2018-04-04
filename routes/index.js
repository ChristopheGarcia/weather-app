var request = require('request');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var options = { server: { socketOptions: {connectTimeoutMS: 5000 } }};
mongoose.connect('mongodb://noel:azerty@ds141351.mlab.com:41351/openweatherapp',
    options,
    function(err) {
     console.log(err);
    }
);

var citySchema = mongoose.Schema({
    name: String,
    desc: String,
    icon: String,
    temp_min: Number,
    temp_max: Number,
    user_id: String,
    lon: Number,
    lat: Number
});
var CityModel = mongoose.model('cities', citySchema);

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});
var UserModel = mongoose.model('users', userSchema);

//var cityList = [];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/signup', function(req, res, next) {

  UserModel.find(
      { email: req.body.email},
      function (err, users) {
        if(users.length == 0) {

        var newUser = new UserModel ({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
        });
        newUser.save(
          function (error, user) {
            req.session.user = user;
            CityModel.find(
                 {user_id: req.session.user._id},
                 function (error, cityList) {
                   res.render('index', { cityList, user : req.session.user });
                 }
             )
          }
        );
      } else {
        res.render('login');
      }
    }
  );
});

router.post('/login', function(req, res, next) {

  UserModel.find(
      { email: req.body.email, password: req.body.password} ,
      function (err, users) {
        if(users.length > 0) {
          req.session.user = users[0];
          CityModel.find(
               {user_id: req.session.user._id},
               function (error, cityList) {
                 console.log(cityList);
                 res.render('index', { cityList, user : req.session.user });
               }
           )
        } else {
          res.render('login');
        }
      }
  )

});

router.get('/view-city', function(req, res, next) {
  CityModel.find(
       {user_id: req.session.user._id},
       function (error, cityList) {
         console.log(cityList);
         res.render('index', { cityList, user : req.session.user });
       }
   )
});

router.post('/add-city', function(req, res, next) {
  request("http://api.openweathermap.org/data/2.5/weather?q="+req.body.city+"&appid=9b754f1f40051783e4f72c176953866e&units=metric&lang=fr", function(error, response, body) {
     body = JSON.parse(body);
     //var city = {name: body.name, desc: body.weather[0].description, icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png", temp_min: body.main.temp_min+"°C", temp_max: body.main.temp_max+"°C"};
     //cityList.push(city);

     var newCity = new CityModel ({
       name: body.name,
       desc: body.weather[0].description,
       icon: "http://openweathermap.org/img/w/"+body.weather[0].icon+".png",
       temp_min: body.main.temp_min,
       temp_max: body.main.temp_max,
       user_id: req.session.user._id,
       lon: body.coord.lon,
       lat: body.coord.lat
     });
     newCity.save(
       function (error, city) {
         CityModel.find(
           {user_id: req.session.user._id},
            function (error, cityList) {
              res.render('index', { cityList, user : req.session.user });
            }
          )
        }
    );

  });

});

router.get('/delete-city', function(req, res, next) {
  //cityList.splice(req.query.position, 1);
  CityModel.remove(
      { _id: req.query.id},
      function(error) {
        CityModel.find(
          {user_id: req.session.user._id},
             function (error, cityList) {
               res.render('index', { cityList, user : req.session.user });
             }
         )
      }
  );
});

module.exports = router;
