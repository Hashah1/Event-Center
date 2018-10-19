//all routes will go here

const express = require('express');
const router = express.Router();

// Get DB Schema
const Item = require('../../models/Item');

// @route  GET api/items
// @desc   Get All Items
// @access Public 
router.get('/', (req, res) => {
    Item.find()
     .sort({date: -1})
     .then(items => res.json(items))
}); // represents /api/items

// @route  POST api/items
// @desc   Create an Items
// @access Public 
router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });
    
    // save in db
    newItem.save().then(item => res.json(item)); // save and spit out item in json
}); // represents /api/items


// @route  DELETE api/items/:id
// @desc   Delete an Items
// @access Public 
router.delete('/:id', (req, res) => {
    Item.findById(req.params.id)
     .then(item => item.remove()
                    .then( () => res.json({success: true})))
                    .catch(err => res.status(404).json({success: false}))
})


module.exports = router;