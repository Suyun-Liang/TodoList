const express = require('express');
// require local module which binds all the exports to the const date 
const date = require(__dirname + '/date.js');

const app = express();
const port = 3000;

// setup templates
app.set('view engine', 'ejs');
// setup bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// serve up all the files in public folder eg .css .png
app.use(express.static("public"));

// store user input data
const items = ["buy sth", "cook sth", "eat sth"];
const workItems = ["study", "javascript fundation"];


/* page ListMain */


app.get('/', function(req, res) {
    
    // call the function thats bound to const date, get the result and assign it to the todayStr
    const todayStr = date.getDate();

    // send user templating file with dynamic date, items array, and the path of the page
    res.render('ListMain', {listTitle: todayStr, listItems: items, path: req.url});
});

app.post('/', function(req, res) {
    
    // collect user input
    const item = req.body.newItem;
    
    // store each input into an array called items
    items.push(item);

    res.redirect('/');
});


/* Page Work */


app.get('/work', function(req, res){
    
    res.render('ListMain', {listTitle: 'Work List', listItems: workItems, path: req.url});
});


app.post('/work', function(req, res) {
    
    const item = req.body.newItem;

    workItems.push(item);

    res.redirect('/work');   
});


/* Page About */

app.get('/about', function(req, res) {
    res.render("about");
});


app.listen(port, function() {
    console.log('Server is running on ' + port);
});
