const Sentiment =require("sentiment");
const translate =require("translate-google");

exports.indexTextSentiment = async (req, res) => {
    res.render('pages/textSentiment', {
        layout: 'layouts/main',
        title: 'Text Sentiment'
    });
}

exports.postTextSentiment = async (req, res) => {
    try {
        const sentiment = new Sentiment();
        
        const text = req.body.text_sentiment
        .toLowerCase()
        .replace(/(?:https?|http):\/\/[\n\S]+/g, '')
        .replace(/\B@[a-z0-9_-]+/gi, '')
        .replace(/[^a-zA-Z ]/g, '')
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')

        // translate text ke bahasa inggris
        const trans = await translate(text, {to: 'en'});
        
        // analisis sentiment
        const hasil = sentiment.analyze(trans);
        
        res.render('pages/textSentiment', {
            layout: 'layouts/main',
            title: 'Text Sentiment',
            hasil,
            text_sentiment: req.body.text_sentiment
        });

        // res.json(hasil);

    } catch (error) {
        res.send("Error: " + error);
        console.log(error);
    }
}