const express =require("express");
const multer =require("multer");
const path =require("path");
const router = express.Router();

const {index, excelExample, uploadExcel} = require('../controllers/dashboardController.js');
const {listBatch, batchDetail} = require('../controllers/listBatchController.js');
const {indexTextSentiment, postTextSentiment} = require('../controllers/textSentimentController.js');

// set multer
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    }
});

router.post('/upload-excel', multer({storage: diskStorage}).single('excel-sentiment'), uploadExcel);
router.get('/', index);
router.get('/excel-example', excelExample);

// batch
router.get('/list-batch', listBatch);
router.get('/list-batch/:id', batchDetail);

// text sentiment
router.get('/text-sentiment', indexTextSentiment);
router.post('/text-sentiment', postTextSentiment);

exports.router = router;