/** Contains routes for the form DB */
const express = require('express');
const router = express.Router();
const settings = require('../../config/settings');
var passport = require('passport');
require('../../config/passport')(passport);
var jwt = require('jsonwebtoken');

// Include our Form schema
const Form = require('../../models/form');

////////////////////////////////
// getToken ->
// Gets the token from each user
////////////////////////////////
getToken = function (headers) {
	if (headers && headers.authorization) {
	  var parted = headers.authorization.split(' ');
	  if (parted.length === 2) {
		return parted[1];
	  } else {
		return null;
	  }
	} else {
	  return null;
	}
  };

//////////////////////////////
// getUserIdFromToken ->
// Responsible for getting the
// specific user id
//////////////////////////////
getUserIdFromToken = function(token) {
	if (!token) {
		return undefined;
	}
	let decodedToken; 
	try  {
		decodedToken = jwt.verify(token, settings.secret);
	} catch (e) {
		return undefined;
	}
	console.log("Decoded token is:");
	console.dir(decodedToken);

	let userId = decodedToken._id;
	return userId;
};

//////////////////////////////
// POST API
//////////////////////////////
router.post('/', passport.authenticate('jwt', {session: false}), (req,res) => {
	const token = getToken(req.headers);
	const userId = getUserIdFromToken(token);

	if (!userId) {
		return res.status(403).send({success: false, msg: "error posting"});
	}

	const data = {...req.body, authorId: userId};
	console.log("Final data in post:");
	console.dir(data);
	Form.create(data)
	.then(newForm => {
		// return json response
		res.json({
			success: true,
			data: newForm
		})
	})
	.catch(err => {
		res.json({
			success: false,
			message: err.message
		})
	})
});

//////////////////////////////
// GET API
//////////////////////////////
router.get('/', passport.authenticate('jwt', {session: false}), (req,res) => {
	const token = getToken(req.headers);
	const userId = getUserIdFromToken(token);

	if (!userId) {
		return res.status(403).send({success: false, msg: "error posting"});
	}

	// Get query from url
	const query = req.query;

	const data = {...query, authorId: userId};

	// query every forms in our db
	Form.find(data)
	.then(forms => {
		// return json response
		res.json({
			status: true,
			data: forms
		})
	})
	.catch(err => {
		res.json({
			status: false,
			message: err.message
		})
	})
});

//////////////////////////////
// POST API
// to update an event
//////////////////////////////
router.post('/update/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
	const id = req.params.id;
	Form.findByIdAndUpdate(id, req.body, {new: true})
	.then(updatedForm => {
		// return successful response
		res.json({
			confirmation: 'Successful',
			form: updatedForm
		});
	})
	.catch (err => {
		// return unsuccessful response
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		});
	});	
  });
  
// This route DELETES
router.get('/remove/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
	console.log("in delete route with id:" + req.params.id)
	Form.findByIdAndRemove(req.params.id)
	.then(updatedForm => {
		// return successful response
		res.json({
			confirmation: 'Successful',
			form:  updatedForm
		});
	})
	.catch (err => {
		// return unsuccessful response
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		});
	});	
  });

  /////////////////////////////////
  // To handle query GETS an ID
  // Should return items matching
  // the id in the parameter passed
  /////////////////////////////////
router.get('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
	const token = getToken(req.headers);
	if (!token) {
		return res.status(403).send({success: false, msg: "Token not found"});
	}
	const id = req.params.id;
	console.log("received id: " + id);
	Form.findById(id)
	.then(forms => {
		// return json successful response
		res.json({
			confirmation: 'Successful',
			data: forms
		})
	})
	.catch (err => {
		// return json unsuccessful response
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		})
	})
});

module.exports = router;