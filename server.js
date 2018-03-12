var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

var path = require('path');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/static')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
var mongoose = require('mongoose'); //require mongoose
mongoose.connect('mongodb://localhost/1955db');
mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2}
}, {timestamps: true})

mongoose.model('User', UserSchema);
var User = mongoose.model('User');



app.get('/', function(req, res){
    console.log('get data: ', req.params);
    User.find({}, function(err, users){
        if(err){
            console.log('Something went wrong fetching users');
            res.json({message: 'Error', error: err})
        }
        else{
            res.json({data: users})
        }
    })
})

app.get('/:name', function(req, res){
    User.findOne({name: req.params.name}, function(err, users){
        if(err){
            res.json({message: 'Error', error: err})
        }
        else{
            res.json({data: users})
        }
    })
})

app.get('/new/:name', function(req, res){
    var new_user = new User({name: req.params.name});
    new_user.save(function(err, users){
        if(err){
            console.log('Something went wrong creating new user');
            res.json({message: 'Error', error: err})
        }
        else{
            res.json({message: 'Success', data: users})
        }
    })
})

app.get('/remove/:name', function(req, res){
    User.remove({name: req.params.name}, function(err, users){
        if(err){
            res.json({message: 'Error', error: err})
        }
        else{
            res.json({message: 'Success', data: users})
        }
    })
})

app.listen(8000, function(){
    console.log("Listening on port 8000");
})