const getOriginalURL = require('./controller');

const handleRoute = async (shortLink) => {
    console.log(shortLink);
    const OGURL = await getOriginalURL(shortLink);
    console.log("Hello"+OGURL);
    return OGURL;
}

module.exports = handleRoute;