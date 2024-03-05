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

const getOriginalURL = async(shortURL) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT NOW()', async (err, res) => {
      if (err) {
        console.error('Error executing query:', err);
        reject(err);
      } else {
        console.log('Database connection successful.');
        const result = await pool.query("Select originalurl, urlcreatetime from urllinker where shorturl='"+shortURL+"'");
        if(result.rows[0]!=null)
        {
          if(isExpired(result.rows[0]['urlcreatetime'],getCurrentDate()))
          {
            pool.query("Delete from urllinker where shorturl = $1 ;",[shortURL]);
            pool.query("Delete from urllocation where shorturl = $1 ;",[shortURL]);
            pool.query("Delete from urlanalytics where shorturl = $1 ;",[shortURL]);
            resolve("../");
          }
          else
          {
            console.log(result.rows[0]['originalurl']);
            resolve(result.rows[0]['originalurl']);
          }
        }
        else{
          resolve("../");
        }
      }
    });
  });
}

module.exports = getOriginalURL;