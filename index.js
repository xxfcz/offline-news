require('es6-promise').polyfill();
require('isomorphic-fetch');

var port = 8081;
var api = 'http://localhost:' + port + '/stories';
var express = require('express');
var path = require('path');
var templates = require('./public/templates');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/* server api */
var articles = [{
		guid: '1',
		title: '标题1',
		body: '详细1'
	},{
		guid: '2',
		title: '标题2',
		body: '详细2'
	}];

app.get('/stories', function (req, res) {
	res.send(articles);
});

app.get('/stories/:guid', function (req, res) {
	res.send(articles.find(function(e){
		return req.params.guid == e.guid;
	}));
});

/* ----------------------------------------------------- */

app.get('/article/:guid', function (req, res) {
	fetch(api + '/' + req.params.guid)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			res.send(layoutShell({
				main: templates.article(data)
			}));
		}, function (err) {
			res.status(404);
			res.send(layoutShell({
				main: templates.article({
					title: 'Story cannot be found',
					body: '<p>Please try another</p>'
				})
			}));
		});
});

app.get('/', function(req, res) {
	fetch(api)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			res.send(layoutShell({
				main: templates.list(data)
			}));
		}, function(err) {
			res.status(404).end();
		});
});

function layoutShell(data) {
	data = {
		title: data && data.title || 'FT Tech News',
		main: data && data.main || ''
	};
	return '<!DOCTYPE html>'
		+ '\n<html>'
		+ '\n  <head>'
		+ '\n    <title>' + data.title + '</title>'
		+ '\n    <link rel="stylesheet" href="/styles.css" type="text/css" media="all" />'
		+ '\n  </head>'
		+ '\n  <body>'
		+ '\n    <main>'+data.main+'</main>'
		+ '\n    <script src="/indexeddb.shim.min.js"></script>'
		+ '\n    <script src="/fetch.js"></script>'
		+ '\n    <script src="/promise.js"></script>'
		+ '\n    <script src="/templates.js"></script>'
		+ '\n    <script src="/application.js"></script>'
		+ '\n  </body>'
		+ '\n</html>';}

app.listen(port);
console.log('listening on port', port);
