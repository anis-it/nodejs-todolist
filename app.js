var express = require("express");
var session = require("cookie-session");
var bodyParser = require("body-parser"); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

//on utilise les sessions
app
  .use(session({ secret: "todotopsecret" }))

  // si la todo est vide on l'initialise à vide
  .use((req, res, next) => {
    if (typeof req.session.todolist == "undefined") {
      req.session.todolist = [];
    }
    next();
  })

  //affiche la todolist
  .get("/todo", (req, res) => {
    res.render("page.ejs", { todolist: req.session.todolist });
  })

  //ajoute une tache a la todolist
  .post("/todo/ajouter", urlencodedParser, (req, res) => {
    if (req.body.newTodo != "") {
      // on ajoute une nouvelle tache
      req.session.todolist.push(req.body.newTodo);
    }
    res.redirect("/todo");
  })

  // supprimer une tache
  .get("/todo/supprimer/:id", (req, res) => {
    req.session.todolist.splice(req.params.id, 1);
    res.redirect("/todo");
  })

  /* On redirige vers la todolist si la page demandée n'est pas trouvée */
  .use(function(req, res, next) {
    res.redirect("/todo");
  })

  .listen(8080);
