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
        
        // translate text ke bahasa inggris
        const trans = await translate(req.body.text_sentiment, {to: 'en'});
        
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