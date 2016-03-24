'use strict';
var _ = require('underscore');

var logger = require('../lib/logging.js');
var List = require('../model/aiwf.js').List;
var Gift = require('../model/aiwf.js').Gift;

var express = require('express');
var router = express.Router();

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

router.use(function(req, res, next) {
	if (req.user.roles.indexOf('admin') >= 0) {
		next();
	} else {
		res.sendStatus(403);
	}
	
});

router.get('/', ensureLoggedIn, function (req, res) {
	var allLists;
	List.find({ }, {}, { sort: 'name' })
		.then(function(lists) {
			allLists = lists;
			return Gift.find({ }, {}, { sort: 'name' });
		})
		.then(function(gifts) {
			res.render('admin/index', { lists: allLists, gifts: gifts });
		})
		.catch(function(err) {
			logger.error(err);
		});
});

module.exports = router;