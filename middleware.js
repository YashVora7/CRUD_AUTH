const jwt = require("jsonwebtoken")

const auth = (req,res,next) => {
    let token = req.headers.authorization.split(' ')[1]

    if(token){
        let decode = jwt.verify(token,"yash")
        next()
        req.body.userId = decode.id
    }
    else{
        res.status(400).send("Error Found")
    }

}

module.exports = auth