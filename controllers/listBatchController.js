const models = require('../models/index.js');

exports.listBatch = async (req, res) => {
    const data = await models.batchs.findAll({
        order: [
            ["createdAt", "DESC"]
        ],
    });
    
    res.render("pages/listBatch" ,{
        layout: 'layouts/main',
        title: 'List Batch',
        data,
    })
};

exports.batchDetail = async (req, res) => {
    const data = await models.sentiments.findAll({
        where: {
            batch_id: req.params.id
        },
        order: [
            ["createdAt", "ASC"]
        ],
    });

    res.render("pages/listBatchDetail" ,{
        layout: 'layouts/main',
        title: 'List Batch',
        data,
    })
}