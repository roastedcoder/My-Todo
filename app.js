

const express = require("express");
const mongoose = require('mongoose');
const date = require(__dirname + "/local_node_modules/date.js");

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todoDB');

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- hit this button to delete an item."
});

const defaultItems = [item1, item2, item3];

const todos = []; // we can modify the const array but can't reassign it to a new array
const workTodos = [];

app.get("/", function(req, res) {

    let today = date.today(); // using local module

    Item.find({}, function(err, foundItems) {

        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if(err) console.log(err);
                else console.log("Successfully saved to database");
            });
        }

        res.render("list", { // This assumes a views directory containing an list.ejs page.
            listTitle: today,  // key(inside ejs) - value(current value) pair
            newItem: foundItems
        });
    });

    
});


app.post("/", function(req, res) {

    const itemName = req.body.inputTodo
    console.log(itemName);
    const currItem = new Item({
        name: itemName
    });

    currItem.save();

    res.redirect('/');
});


app.get("/work", function(req, res) {
    res.render("list", {
        listTitle: "Work List",
        newItem: workTodos
    })
});

app.post("/work", function(req, res) {

    let currWorkTodo = req.body.inputTodo.toString();
    workTodos.push(currWorkTodo);

    res.redirect("/work");
});







app.listen(3000, function() {
    console.log("Server live at 3000...");
});
