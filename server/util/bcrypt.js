const bcrypt = require('bcrypt');

//local modules
const  SALTROUND =process.env.SALTROUND

module.exports= {

    bcryptData: (data) => {
        return new Promise(async (resolve, reject) => {
            console.log("password:", data);
            console.log("salt:", SALTROUND);
            try {
                const hash = await bcrypt.hash(data, parseInt(SALTROUND))
           

                resolve(hash)

            } catch (error) {
                reject({
                    error
                })
            }

        })


    },

    bcryptCompare: (password, hash) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, result) {
                console.log('password:', password + '\n hashcode:', hash);

                if (err) {
                    console.log('p error', err);

                    reject(err.message)
                } else {
                    console.log('reuslt:', result);
                    result ? resolve(result ) :reject('Password is incorrect')
                }


            });
        })


    }


}