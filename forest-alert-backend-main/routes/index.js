const express = require('express');
const router = express.Router();
const imageController = require('../controller/imageController');
const multer = require('multer');
const fs = require('fs');

global.ROOT = __dirname;
global.PATH = ROOT  + "/image";

if(!fs.existsSync(PATH))
{
    fs.mkdirSync(PATH,0777);
}

const file = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH)
  },
  filename: function (req, file, cb) {
    cb(null, 'image.jpg')
  }
})

const store = multer({storage: file})

router.get('/', function(req, res, next) {
  res.status = 200;
  res.send("Status OK!");
});

router.post('/recognize', store.any() , imageController.recognize);

module.exports = router;
