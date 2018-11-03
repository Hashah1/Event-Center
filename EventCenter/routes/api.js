//all routes will go here

const express = require('express');
const router = express.Router();

// Include our Form schema
const Form = require('../models/form')

// This route POSTs - The 'C' in CRUD
router.post('/form', (req,res) => {
	Form.create(req.body)
	.then(forms => {
		// return json response
		res.json({
			confirmation: 'success',
			data: forms
		})
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			data: err.message
		})
	})
})

// This route GETs - The 'R' in CRUD
router.get('/form', (req,res) => {
	// Get query from url
	const query = req.query

	// query every forms in our db
	Form.find(query)
	.then(forms => {
		// return json response
		res.json({
			confirmation: 'success',
			data: forms
		})
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			data: err.message
		})
	})
})

// This route UPDATES - The 'U' in CRUD
/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {
	Book.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
	  if (err) return next(err);
	  res.json(post);
	});
  });

  // To handle query GETS an ID
  // Should return items matching the id in the parameter passed
router.get('/form/:id', (req,res) => {
	const id = req.params.id
	Form.findById(id)
	.then(forms => {
		// return json response
		res.json({
			confirmation: 'success',
			data: forms
		})
	})
	.catch (err => {
		// return json response
		res.json({
			confirmation: 'success',
			data: err.message
		})
	})
})





module.exports = router;