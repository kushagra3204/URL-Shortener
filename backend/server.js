const express = require('express');
const geoip = require('geoip-lite');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

async function checkRoute(shortLink){
    var sc = await require("./routes.js")(shortLink);
    return sc;
}

app.get('/:shortLink', async (req, res) => {
    try {
      if(req.params.shortLink!=='favicon.ico' && req.params.shortLink){
        const originalURL = await checkRoute(req.params.shortLink);
        res.redirect(originalURL);
        require('./CheckURL')(req.params.shortLink,(error,isPresent) => {
          if(error){
            console.log("error");
          } else {
            if(isPresent){
              require('./accessURL.js').addURLLocation(req,req.params.shortLink,(error,isAdded1) => {
                if(error){
                  console.log("Server.js "+error);
                } else {
                  console.log(isAdded1);
                  require('./accessURL.js').addURLAnalytics(req,req.params.shortLink,(error,isAdded2) => {
                    if(error){
                      console.log("Server.js "+error);
                    } else {
                      console.log(isAdded2);
                    }
                  });
                }
              });
            }
          }
        });
      }
      // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      // console.log(ip);
      // const geo = geoip.lookup(ip);
      // console.log(geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Localhost');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/tp.html');
});


app.post('/api/url', (req, res) => {
  let { ogURL } = req.body;
  require('./linkGenerator').urlGenerator(req,ogURL, (error, sURL) => {
    if (error) {  
      console.error("Error:", error);
      res.status(500).json({ "error": "Internal Server Error" });
    } else {
      res.json({ "sURL": sURL });
    }
  });
});

app.post('/api/shorturl/analytics',(req,res) => {
  let {shorturl} = req.body;
  require('./Analytics').LocationAnalytics(shorturl,(error,LocationAnalytics) => {
    if(error){
      res.status(500).json({ "error": "Internal Server Error1" });
    } else {
      require('./Analytics').DayCountAnalytics(shorturl,(error,DayCountAnalytics) => {
        if(error){
          res.status(500).json({ "error": "Internal Server Error2" });
        } else {
          require('./Analytics').NumTimeAccessedAnalytics(shorturl,(error,NumTimeAccessed) => {
            if(error){
              res.status(500).json({"error": "Internal Server Error3"});
            } else {
              require('./Analytics').HourAnalytics(shorturl,(error,HourAnalytics) => {
                if(error){
                  res.status(500).json({ "error": "Internal Server Error4" });
                } else {
                  res.json({
                    'Location': LocationAnalytics,
                    'Day': DayCountAnalytics,
                    'NumTimeAccessed': NumTimeAccessed,
                    'Hours': HourAnalytics
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.post('/api/verify/user',(req,res)=>{
  require('./verifyUser').verifyEmail(req,(error,successful) => {
    if(error) {
      console.error("Error:", error);
      res.status(500).json({"error": "Internal Server Error"});
    } else {
      res.json({"successful": successful});
    }
  });
});

app.post('/api/add/user',(req,res) => {
  require('./addUsers.js').addEmailUser(req,(error,successful)=>{
    if(error){
      console.log("Error: ",error);
      res.status(500).json({"error": "Internal Server Error"});
    } else {
      res.json({"successful": successful});
    }
  });
});


app.post('/api/customurl', (req, res) => {
  require('./linkGenerator').customURLGenerator(req, res, (error, successful) => {
    if (error) {
      console.error("Error:", error);
      res.status(500).json({"error": "Internal Server Error"});
    } else {
      res.json({"successful": successful});
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running...');
});