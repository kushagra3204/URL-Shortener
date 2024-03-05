const pool = require('./db');

function CheckURL(shortLink,callback) {
    pool.query('select * from urllinker where shorturl = $1 ;',[shortLink],(error,results) => {
        if(error){
            console.log(error);
            callback(error,null);
        } else {
            if(results.rows.length>0)
                callback(null,true);
            else
                callback(null,false);
        }
    });
}

module.exports = CheckURL;