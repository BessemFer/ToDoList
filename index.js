var express = require('express');
var session = require('cookie-session'); // charger  middleware de session
var bodyParser = require('body-parser'); // charger le middleware de gestion des paramétres 
var path  = require('path');
var urlencodedParser = bodyParser.urlencoded({extended:false});

var app = express();
/*
config app
*/
app.set('view engine', 'ejs');
app.set('views',path.join( __dirname, 'views'));
//app.set('/css',path.join( __dirname, 'css'));

/*
use middleware
*/
// utilisation des sessions
app.use(session({secret: 'simplesecret'}));
app.use(express.static(path.join(__dirname, '/assest')));

/*
define routes 
*/
// si ilnya pas de todo liste dans la session on créé une vid sou form d'un array

app.use(function(req, res, next) {
	if(typeof(req.session.todolist) == 'undefined') {
		req.session.todolist = [];
	}
	next();
});

// affichage du todo list et du formulaire 
app.get('/todo', function(req, res) {
	res.render('todo.ejs', {todolist:req.session.todolist})
});

// ajout des elemnt à la todolist
app.post('/todo/ajouter',urlencodedParser, function(req, res, next){ // important d'ajouter le middle ware body parser pour extraitre les donné
	if(req.body.newtodo !== '') {
		req.session.todolist.push(req.body.newtodo);
	}
	res.redirect('/todo');
});
// suppression d'un element de la todo list
app.get('/todo/supprimer/:id', function(req, res) {
	if(req.params.id !=='') {
		req.session.todolist.splice(req.params.id, 1);
	}
	res.redirect('/todo');
});

// rederiction ver une page todo si la page demander n'est pas reconue 
app.use(function(req, res, next) {
	res.redirect('/todo');
});

app.listen(8000);