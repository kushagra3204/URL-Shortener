const pool = require('./db');

function LocationAnalytics(shortlink,callback) {
    var dbquery = "Select location, count(*), count(*)*100/(select count(*) from urllocation where shorturl = $1) as percentage from urllocation where shorturl = $1 group by location order by count desc limit 10;"
    var values = [shortlink];
    pool.query(dbquery,values,(error,result) => {
        if(error) {
            callback(error,null);
        } else {
            callback(null,result.rows);
        }
    });
}

function DayCountAnalytics(shortlink,callback) {
    var dbquery = "SELECT CASE "+
                    "WHEN EXTRACT(DOW FROM time) = 0 THEN 'Sunday' "+
                    "WHEN EXTRACT(DOW FROM time) = 1 THEN 'Monday' "+
                    "WHEN EXTRACT(DOW FROM time) = 2 THEN 'Tuesday' "+
                    "WHEN EXTRACT(DOW FROM time) = 3 THEN 'Wednesday' "+
                    "WHEN EXTRACT(DOW FROM time) = 4 THEN 'Thursday' "+
                    "WHEN EXTRACT(DOW FROM time) = 5 THEN 'Friday' "+
                    "WHEN EXTRACT(DOW FROM time) = 6 THEN 'Saturday '"+
                "END AS day, COUNT(*) AS count_per_hour FROM urllocation WHERE shorturl = $1 GROUP BY shorturl, day ORDER BY shorturl, day;";
    var values = [shortlink];
    pool.query(dbquery,values,(error,result) => {
        if(error) {
            callback(error,null);
        } else {
            callback(null,result.rows);
        }
    });
}

function NumTimeAccessedAnalytics(shortLink,callback) {
    var dbquery = "SELECT SUM(CAST(numtimeaccessed AS numeric)) AS totaltimeaccessed, COUNT(DISTINCT ip) AS distinctusers FROM urlanalytics where shorturl = $1 GROUP BY shorturl;";
    var values = [shortLink];
    pool.query(dbquery,values,(error,result) => {
        if(error) {
            callback(error,null);
        } else {
            callback(null,result.rows);
        }
    });
}

function HourAnalytics(shortLink,callback) {
    var dbquery = "SELECT CASE "+
                            "WHEN EXTRACT(HOUR FROM time) = 0 THEN '0' "+
                            "WHEN EXTRACT(HOUR FROM time) = 1 THEN '1' "+
                            "WHEN EXTRACT(HOUR FROM time) = 2 THEN '2' "+
                            "WHEN EXTRACT(HOUR FROM time) = 3 THEN '3' "+
                            "WHEN EXTRACT(HOUR FROM time) = 4 THEN '4' "+
                            "WHEN EXTRACT(HOUR FROM time) = 5 THEN '5' "+
                            "WHEN EXTRACT(HOUR FROM time) = 6 THEN '6' "+
                            "WHEN EXTRACT(HOUR FROM time) = 7 THEN '7' "+
                            "WHEN EXTRACT(HOUR FROM time) = 8 THEN '8' "+
                            "WHEN EXTRACT(HOUR FROM time) = 9 THEN '9' "+
                            "WHEN EXTRACT(HOUR FROM time) = 10 THEN '10' "+
                            "WHEN EXTRACT(HOUR FROM time) = 11 THEN '11' "+
                            "WHEN EXTRACT(HOUR FROM time) = 12 THEN '12' "+
                            "WHEN EXTRACT(HOUR FROM time) = 13 THEN '13' "+
                            "WHEN EXTRACT(HOUR FROM time) = 14 THEN '14' "+
                            "WHEN EXTRACT(HOUR FROM time) = 15 THEN '15' "+
                            "WHEN EXTRACT(HOUR FROM time) = 16 THEN '16' "+
                            "WHEN EXTRACT(HOUR FROM time) = 17 THEN '17' "+
                            "WHEN EXTRACT(HOUR FROM time) = 18 THEN '18' "+
                            "WHEN EXTRACT(HOUR FROM time) = 19 THEN '19' "+
                            "WHEN EXTRACT(HOUR FROM time) = 20 THEN '20' "+
                            "WHEN EXTRACT(HOUR FROM time) = 21 THEN '21' "+
                            "WHEN EXTRACT(HOUR FROM time) = 22 THEN '22' "+
                            "WHEN EXTRACT(HOUR FROM time) = 23 THEN '23' "+
                        "END AS hourinterval,  COUNT(*) AS countperhour FROM urllocation WHERE shorturl = $1 GROUP BY shorturl, hourinterval ORDER BY shorturl, hourinterval;";
    
    var values = [shortLink];
    pool.query(dbquery,values,(error,result) => {
        if(error) {
            callback(error,null);
        } else {
            callback(null,result.rows);
        }
    });
}

module.exports = {
    LocationAnalytics,
    DayCountAnalytics,
    NumTimeAccessedAnalytics,
    HourAnalytics,
}