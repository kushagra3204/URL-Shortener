const pool = require('./db.js');

function verifyEmail(req,callback) {
    const {email,password} = req.body;
    const queryString = 'SELECT email, password FROM urluserinfo WHERE email = $1 AND password = $2';
    const values = [email, password];
    pool.query(queryString, values, (error, results) => {
        if (error) {
            console.error(error);
            callback(error, null);
        } else {
            if (results.rows.length > 0) {
                console.log('Login successful!');
                callback(null,true)
            } else {
                console.log('Invalid email or password.');
                callback(null,false);
            }
        }
    });
}

function verifyGoogle() {
    console.log("Verify Google");
}

function verifyFacebook() {
    console.log("Verify Facebook");
}

function verifyMicrosoft() {
    console.log("Verify Microsoft");
}

module.exports = {
    verifyEmail,
    verifyGoogle,
    verifyFacebook,
    verifyMicrosoft
};