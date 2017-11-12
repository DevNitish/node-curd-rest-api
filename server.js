var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
var Bear=require('./app/models/bear.js')
mongoose.connect('mongodb://localhost:27017/myDb')
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));//basically tells the system whether you want to use a simple algorithm for 
                                                  //shallow parsing (i.e. false) or complex algorithm for deep parsing that 
                                                  //can deal with nested objects (i.e. true).  
app.use(bodyParser.json());//basically tells the system that you want json to be used.

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req,res,next){

        console.log("looging here ",req.body)
    next()
})

router.use(function(req,res,next){
    
            console.log("looging here 2 ",req.body)
        next()
    })
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

router.route('/bears')
    .post(function(req,res){

        var bear=new Bear();
        bear.name=req.body.name;

        bear.save(function(err,data){
            if(err)
            res.send(err)
            else
            res.send("bear with name "+data.name+" created!")
        })
    })

    .get(function(req,res){
    
        Bear.find(function(err,data){

            if(err)
            res.send(err)
            else
            res.json(data);
        })
    })

router.route("/bears/:bearid")

    .get(function(req,res){

        Bear.findById(req.params.bearid,function(err,data){
            if(err)
            res.send(err)
            else
            res.jsonp(data);
        })
    })

    .put(function(req,res){

        Bear.findById(req.params.bearid,function(err,bear){
            if(err)
            res.send(err)

            bear.name=req.body.name; 
            bear.save(function(err,bear){
                if(err)
                res.send(err)
                else
                res.send("bear name changed to "+bear.name);
            })
        })
    })
    .delete(function(req,res){

        Bear.remove({_id:req.params.bearid},
            
            function(err,bear){
            if(err)
            res.send(err)
            else
            res.send("bear "+bear.name+" deleted");

        })
    })
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);