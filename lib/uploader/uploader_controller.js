var express = require('express');
var router = express.Router();
var uploader = require('./uploader');

router.post('/',uploader.uploadTerminalFile(__dirname));


// -- exports
module.exports = router;