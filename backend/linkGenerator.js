const pool = require('./db.js');

function dateDifference(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const timeDifference = date2 - date1;
    const differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return differenceInDays;
}

function getCurrentDate()
{
    var currentTime = new Date()
    var currentDate = currentTime.getUTCFullYear() + "-" + currentTime.getUTCMonth()+1 + "-" + currentTime.getUTCDate();
    return currentDate
}

function isExpired(prevTime, currTime){
    if(dateDifference(prevTime,currTime)<=2){
        return false;
    }
    return true;
}

function generateRandomString() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function urlGenerator(req, ogUrl, callback) {
    let randomString = generateRandomString();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    pool.query("Select originalurl,urlcreatetime from urllinker where shorturl='" + randomString + "';", async (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            if (result.rows[0] == null) {
                pool.query("insert into urllinker(shorturl,originalurl,urlcreatetime,ip) values($1,$2,$3,$4);",[randomString,ogUrl,getCurrentDate(),ip]);
                callback(null, randomString);
            }
            else{
                if(isExpired(result.rows[0]['urlcreatetime'],getCurrentDate()))
                {
                    pool.query("Delete from urllinker where shorturl='"+randomString+"';");
                }
                while (result.rows[0] != null) {
                    randomString = generateRandomString();
                    result = await pool.query("Select originalurl from urllinker where shorturl='" + randomString + "';");
                }
            }
        }
    });
}


function customURLGenerator(req, res, callback) {
    let { ogURL, customURL } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(ogURL);
    console.log(customURL);
    var successful = false;
    pool.query("SELECT originalurl FROM urllinker WHERE shorturl='" + customURL + "';", (error, results) => {
        if (error) {
            console.error(error);
            callback(error, null);
        } else {
            if (results.rows.length) {
                if(isExpired(results.rows[0]['urlcreatetime'],getCurrentDate()))
                {
                    pool.query("Delete from urllinker where shorturl='"+customURL+"';");
                    pool.query("INSERT INTO urllinker(shorturl, originalurl,urlcreatetime,ip) VALUES($1,$2,$3,$4);",[customURL,ogURL,getCurrentDate(),ip],(error) => {
                        if (error) {
                            console.error(error);
                            callback(error, null);
                        } else {
                            successful = true;
                            console.log(successful);
                            callback(null, successful);
                        }
                    });
                }
                else {
                    successful = false;
                    console.log(results);
                    callback(null, successful);
                }
            } else {
                pool.query("INSERT INTO urllinker(shorturl, originalurl,urlcreatetime,ip) VALUES($1,$2,$3,$4);",[customURL,ogURL,getCurrentDate(),ip],(error) => {
                    if (error) {
                        console.error(error);
                        callback(error, null);
                    } else {
                        successful = true;
                        console.log(successful);
                        callback(null, successful);
                    }
                });
            }
        }
    });
}

module.exports = {
    urlGenerator,
    customURLGenerator
};