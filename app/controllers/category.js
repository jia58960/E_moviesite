var mongoose = require('mongoose');
var Category = require('../models/category');

exports.new = function(req, res) {
  res.render('category_admin', {
    title: '电影分类录入',
    category: {}
  });
};

exports.save = function(req, res) {
  var _category = req.body.category;
  var cateObj = new Category(_category);
  cateObj.save(function(err, category) {
    if (err) console.log(err);
    res.redirect('/admin/category/list');
  });
};

exports.list = function(req, res) {
	Category.fetch(function(err, categories) {
    if (err) {
      console.log(err);
    }
    res.render('categorylist', {
      title: '电影分类列表',
      categories: categories
    });
  });
};

exports.del = function(req, res) {
  var id = req.query.id;
  if (id) {
    Category.remove({ _id: id }, function(err, user) {
      if (err) {
        console.log(err);
        res.json({success: 0});
      } else {
        res.json({ success: 1 });
      }
    });
  }
};