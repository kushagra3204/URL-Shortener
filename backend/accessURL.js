const pool = require('./db.js');
const geoip = require('geoip-lite');

function addURLLocation(req,shortLink,callback) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = geoip.lookup(ip);
    const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Localhost';
    const time = new Date();
    const values = [shortLink,location,time];
    const dbquery = 'insert into urllocation values ($1,$2,$3)';
    pool.query(dbquery,values,(error,results) => {
        if(error) {
            console.log(error);
            callback(error,null);
        } else {
            console.log("Data Inserted.");
            callback(null,true);
        }
    });
}

function addURLAnalytics(req,shortLink,callback) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    getNumTimeAccessedURL(shortLink,ip,(error,getTimes,notPresent) => {
        if(error) {
            console.log(error);
        } else {
            if(notPresent) {
                pool.query("insert into urlanalytics values($1,$2,$3)",[shortLink,ip,1],(error,result) => {
                    if(error){
                        console.log(error);
                        callback(error,null);
                    } else {
                        callback(error,true);
                        console.log("successfully added in table urlanalytics");
                    }
                });
            } else {
                var dbquery = 'update urlanalytics set numtimeaccessed = $1 where shorturl = $2 and ip = $3';
                var timesAccessed = (parseInt(getTimes)+1).toString();
                var values = [timesAccessed,shortLink,ip];
                pool.query(dbquery,values,(error,result) => {
                    if(error){
                        console.log("Erooor: "+error);
                        callback(error,null);
                    } else {
                        callback(error,true);
                        console.log("successfully updated in table urlanalytics");
                    }
                });
            }
        }
    });
    
}

function getNumTimeAccessedURL(shortLink,ip,callback) {
    pool.query("select numtimeaccessed from urlanalytics where shorturl=$1 and ip=$2",[shortLink,ip],(error,results) => {
        if(error){
            console.log(error);
            callback(error,null,null);
        } else {
            if(results.rows.length>0)
            {
                callback(null,results.rows[0]['numtimeaccessed'],false);
            }
            else {
                callback(error,null,true);
            }
        }
    });
}

module.exports = {
    addURLLocation,
    addURLAnalytics
}