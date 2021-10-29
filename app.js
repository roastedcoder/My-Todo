

const express = require("express");


const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

let todos = [];

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
        typeOfDay: today,  // key(inside ejs) - value(current value) pair
        newItem: todos
    });
});


app.post("/", function(req, res) {
    todos.push(req.body.inputTodo.toString());

    // console.log(todos);
    res.redirect("/");
});


app.listen(3000, function() {
    console.log("Server live at 3000...");
});
