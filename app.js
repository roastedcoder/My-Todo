

const express = require("express");


const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

let todos = [];
let workTodos = [];


app.get("/", function(req, res) {

    let date = new Date();

    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let today = date.toLocaleDateString("en-US", options);

    res.render("list", { // This assumes a views directory containing an list.ejs page.
        listTitle: today,  // key(inside ejs) - value(current value) pair
        newItem: todos
    });
});


app.post("/", function(req, res) {

    if(req.body.todoSubmit == "Work") { // we are getting dynamic value using ejs.
        workTodos.push(req.body.inputTodo.toString());
        res.redirect("/work");
    }
    else {
        todos.push(req.body.inputTodo.toString());
        res.redirect("/");
    }
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
