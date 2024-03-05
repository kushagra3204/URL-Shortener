const { select } = require("async");
const pool = require("./db.js");

function addEmailUser(req,callback) {
    const {fname,lname,email,pass} = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const values = [fname,lname,email,pass,ip];
    const dbquery = "insert into urluserinfo values($1,$2,$3,$4,$5)";
    pool.query(dbquery,values,(error, results) => {
        if(error){
            console.log(error);
            callback(error,null);
        } else {
            console.log('User Added Successfully');
            callback(null,true);
        }
    });
}

function addGoogleUser() {

}

function addFacebookUser() {

}

function addMicrosoftUser() {

}

module.exports = {
    addEmailUser,
    addGoogleUser,
    addFacebookUser,
    addMicrosoftUser
}