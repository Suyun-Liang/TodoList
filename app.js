const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const { name } = require('ejs');

const app = express();
const port = 3000;

// setup templates, bodyparser, local files
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// create a database
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemsSchema = mongoose.Schema({
    name: String
});
const listSchema = mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', listSchema);

const item1 = new Item({
    name: 'Welcome to your todolist!'
});
const item2 = new Item({
    name: 'Hit the + button to add a new item.'
});
const item3 = new Item({
    name: '<-- Hit this to delete an item.'
});
const defaultItems = [item1, item2, item3];

/* Main page*/

app.get('/', function(req, res) { 

    Item.find({})
    .then(value => {
        if(value.length === 0) {
            Item.create(defaultItems)
                .then(() => console.log('successfully insert default items'))
                .catch(err => console.log(err));
            res.redirect('/');
        }

        res.render('ListMain', {listTitle: "Today", listItems: value, path: req.path});
    })
    .catch(err => console.log(err));
    
});


app.post('/', function(req, res) {
        
    const input = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: input
    });

    if(listName === 'Today') {
        Item.create(item);
        res.redirect('/');
    }else {
        List.findOneAndUpdate({name: listName}, {$push:{items: item}})
            .then(() => res.redirect('/' + listName))
            .catch(err => console.log(err)); 
    }
  
});

/* Delete an item from list */

app.post('/delete', function(req, res) {
    const checkedId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === 'Today') {
        Item.findByIdAndRemove(checkedId)
            .then(() => res.redirect('/'))
            .catch(err => console.log(err));  
    }else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id : checkedId}}})
            .then(() => res.redirect('/' + listName))
            .catch(err => console.log(err));
    }

    
});

/* CustomerList page */

app.get('/:customListName', function(req,res) {
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name: customListName})
        .then((list)=> {
            if(!list) {
                List.create({name: customListName, items: defaultItems})
                .then(() => res.redirect('/' + customListName))
                .catch(err => console.log(err));
            }else{
                res.render('ListMain', {listTitle: customListName, listItems: list.items, path: '/'});
            }
        })
        .catch(err => console.log(err));
});


app.listen(port, function() {
    console.log('Server is running on ' + port);
});
