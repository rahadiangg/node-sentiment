const models = require('../models/index.js');
const {Op} = require('sequelize');

exports.listBatch = async (req, res) => {
    const data = await models.batchs.findAll({
        order: [
            ["createdAt", "DESC"]
        ],
    });

    let count = 0;
    for (let d of data) {
        let total = await models.sentiments.count({
            where: {
                batch_id: d.id
            }
        });

        let positive = await models.sentiments.count({
            where: {
                batch_id: d.id,
                score: {
                    [Op.lt]: 0
                }
            }
        });

        let negatif = await models.sentiments.count({
            where: {
                batch_id: d.id,
                score: {
                    [Op.gt]: 0
                }
            }
        });

        let netral = await models.sentiments.count({
            where: {
                batch_id: d.id,
                score: {
                    [Op.eq]: 0
                }
            }
        });

        data[count].persentase_positive = ((positive / total) * 100).toFixed(2);
        data[count].persentase_negative = ((negatif / total) * 100).toFixed(2);
        data[count].persentase_netral = ((netral / total) * 100).toFixed(2);

        count++;
    }
    
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