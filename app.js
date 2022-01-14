

const express = require("express");
const mongoose = require('mongoose');
const _ = require("lodash");
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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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
            listTitle: "Today",  // key(inside ejs) - value(current value) pair
            newItem: foundItems
        });
    });
});


app.post("/", function(req, res) {

    const itemName = req.body.inputTodo;
    const listName = req.body.list;

    const currItem = new Item({
        name: itemName
    });

    if(listName === "Today") {
        currItem.save();
        res.redirect("/");
    }
    else {
        List.findOne({name: listName}, function(err, foundList) {
            foundList.items.push(currItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("Successfully deleted checked items.");
                res.redirect('/');
            }
        });
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            if(!err) {
                res.redirect("/" + listName);
            }
            else {
                console.log(err);
            }
        });
    }
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if(foundList) {
                res.render("list", {
                    listTitle: foundList.name,
                    newItem: foundList.items
                });
            }
            
            else {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
        }
    });

    
});

app.post("/work", function(req, res) {

    let currWorkTodo = req.body.inputTodo.toString();
    workTodos.push(currWorkTodo);

    res.redirect("/work");
});







app.listen(3000, function() {
    console.log("Server live at 3000...");
});
