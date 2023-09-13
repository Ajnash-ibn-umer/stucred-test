const express = require("express");
const formValidator = require("../util/formValidation");
const bcryptUtil = require("../util/bcrypt");
const router = express.Router();
const  { Schema, model } = require( "mongoose");
const { JWTsigning } = require("../util/jwtAuth");
const jwt = require('jsonwebtoken');
// schema definition
const user = new Schema({

    email: { type: String ,unique:true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now()}

})
const userSchema = model('user', user)


//  middleware
const userAuth = (req,res,next) => {
  
        try {
console.log("@ middleware",req.headers.authorization)
   
            jwt.verify(req.headers["authorization"], process.env.JWT_SECRET, async (err, value) => {
                if (err) {
                    console.log(...err.message);
                    res.status(401).json('Authorization failed ,user cant be found')
                } else {
               console.log("varified",value)
req.uid=value.data?.uid
req.email=value.data.email
                    next()

                    

                }
            });
        } catch (error) {
           res.status(401).json({
            success:false,
            msg: error.message ?? error
           })
            

        }

}


router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    console.log({ r: req.body });
    const validationResult = await formValidator.RegisterValidator(data);
    /// email and username existance
    const userExist = await userSchema.exists({ email: data.email });
    if (userExist) throw "This account already exists";
    const hashedPassword = await bcryptUtil.bcryptData(data.password);
    data.password = hashedPassword;
    delete data["confirmPassword"];
    console.log({ data });

    await new userSchema(data).save();
    res.json({
      success: true,
      msg: "Your account created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      msg: error.message ?? error,
    });
  }
});
router.post("/login", async(req, res) => {
  try {
    const data = req.body;
    const loginValidation = await formValidator.LoginValidator(data);
        const userExist = await userSchema
          .findOne({ email: data.email })
          .lean();
        //check existance of user
        if (!userExist) throw "This Account is not existing";

        // check password
        let checkPassword = await bcryptUtil.bcryptCompare(
          data.password,
          userExist.password
        );
        console.log({ checkPassword });
        if (!checkPassword) throw "Password is incorrect";
        const token = await JWTsigning({
          email: userExist.email,
          uid:userExist._id,
  
        });

    res.json({
      success: true,
      msg: "You logged successfully",
      token
    });
  } catch (error) {
    res.json({
      success: false,
      msg: error.message ?? error,
    });
  }
});

router.get("/",userAuth, async(req, res) => {
    try {
   console.log("auth.",req.email);
  
      res.status(200).json({
        success: true,
        msg: "You are authorized",
        
      });
    } catch (error) {
      res.json({
        success: false,
        msg: error.message ?? error,
      });
    }
  });



module.exports = router;
