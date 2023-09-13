const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config()
const JWT_SECRET  = process.env.JWT_SECRET

 const JWTsigning = (data, time="3d") => {
    return new Promise((resolve, reject) => {
        console.log('key:', JWT_SECRET);

        jwt.sign({
            data: data,
        }, JWT_SECRET, { expiresIn: time || "3d" }, (err, decoded) => {
            if (err) {
                console.error(err);

            } else {
                const token = decoded
                console.log('decoded', decoded);
                resolve(token)
            }
        })

    })

}
const JWTverifyToken = ((token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, value) => {
            
            if (err) {
                console.log('error @ jwt',err.message);
                reject(err)
            } else {
                resolve(value)
            }
        });

    })
})

module.exports.JWTsigning=JWTsigning
module.exports.JWTverifyToken=JWTverifyToken

