
const joi = require('joi');
module.exports={

    RegisterValidator: (data) => {
        return new Promise(async (resolve, reject) => {
            const schema = joi.object({
                email: joi.string().min(3).max(30).email().required(),
                password: joi.string().min(8).required(),
                confirmPassword: joi.ref('password'),

            })
            const { error } = await schema.validate(data)
            if (error) {
                console.log('error in validation');

                reject(error.details[0].message)
            } else {
                resolve(true)

            }
        })

    },
    LoginValidator: (data) => {
        return new Promise(async (resolve, reject) => {
            const schema = joi.object({

                email: joi.string().min(3).max(30).email().required(),
                password: joi.string().min(8).required(),
               
            })
            const { error } = await schema.validate(data)
            if (error) {
                reject(error.details[0].message)
            } else {
                resolve(true)

            }
        })

    }}