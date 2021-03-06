const BeeQueue =require("bee-queue");
const fs =require("fs");
const Sentiment =require("sentiment");
const translate =require("translate-google");
const xlsx =require("xlsx");
const models = require('../models/index.js');
const {Op} = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sentimentQueue = new BeeQueue('sentiment', {
    removeOnSuccess: true,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        db: 0,
        options: {},
    }
});

sentimentQueue.process(async (job, done) => {
    try {
        const sentiment = new Sentiment();
        const reader = xlsx.readFile(job.data.file);
        
        // ubah data excel jadi json
        const dataExcel = xlsx.utils.sheet_to_json(reader.Sheets[reader.SheetNames[0]], {header: 1});
                
        for (let d of dataExcel) {

            let text = d[0]
            text = text.toLowerCase()
            .replace(/(?:https?|http):\/\/[\n\S]+/g, '')
            .replace(/\B@[a-z0-9_-]+/gi, '')
            .replace(/[^a-zA-Z ]/g, '')
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
            
            // translate text ke bahasa inggris
            const trans = await translate(text, {to: 'en'});

            // analisis sentiment
            const res = sentiment.analyze(trans);

            // inject text asli
            // res.text = d[0];

            // save data sentiment ke database
            await models.sentiments.create({
                text: text,
                batch_id: job.data.batch_id,
                tokens: res.tokens,
                positive_text: res.positive,
                negative_text: res.negative,
                score: res.score,
                comparative: res.comparative
            });
        }
        
        // hapus file ketika sukses
        fs.unlinkSync(job.data.file);
        done();
        
        // update status batch
        await models.batchs.update(
            {status: "selesai"},
            {where: {id: job.data.batch_id}}
        );

    } catch (error) {
        // hapus file walalupun gagal --> untuk saat ini sementara seperti itu
        fs.unlinkSync(job.data.file);
        console.log(error);
    }
});

async function getData() {
    const positif = await models.sentiments.count({
        where: {
            score: {
                [Op.gt]: 0
            }
        }
    });
    const negatif = await models.sentiments.count({
        where: {
            score: {
                [Op.lt]: 0
            }
        }
    });
    const netral = await models.sentiments.count({
        where: {
            score: {
                [Op.eq]: 0
            }
        }
    });

    const batchs = await models.batchs.findAll({
        order: [
            ["createdAt", "DESC"]
        ],
        limit: 5
    });

    const sentiments = await models.sentiments.findAll({
        order: [
            ["createdAt", "DESC"]
        ],
        limit: 5
    });

    const data = {
        negatif, netral, positif, batchs, sentiments
    };

    return data;
}


exports.index = async(req, res) => {

    res.render('pages/dashboard', {
        layout: 'layouts/main',
        title: 'Dashboard',
        data: await getData()
    });

};

exports.excelExample = async (req, res) => {
    res.sendFile('./sentiment.xlsx', {root: '.'});
};

exports.uploadExcel = async (req, res)=> {
    try {
        const file = req.file.path;
        if(!file) {
            res.status(400).send({
                status: false,
                data: "No file selected!"
            });
        }
        
        createBatch = await models.batchs.create({
            name: file,
            status: "on progress"
        });
        sentimentQueue.createJob({file, batch_id: createBatch.id}).save();  

        res.render('pages/dashboard', {
            layout: 'layouts/main',
            title: 'Dashboard',
            success_upload: true,
            data: await getData()
        });
    } catch(err) {
        return res.json('Error: ' + err);
    }
};