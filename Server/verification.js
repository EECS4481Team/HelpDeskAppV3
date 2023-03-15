const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
    
    if(!request.headers.authorization)
    {
        response.status(401).send("Unauthorized request");
        return
    }
    const token = request.headers["authorization"].split(" ")[1];
    if(!token)
    {
        response.status(401).send("Access denied, No token provided")
        return
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_KEY)
        request.user = decode.user;
        next();
    }catch (err)
    {
        response.status(400).send("Invalid Token")
    }
}


//function verifies user is the same as the user to be altered/deleted (preventing abuse of admin power against other admins)
function verifyUserIdentity(request, response)
{
    let decode = jwt.verify(request.headers["authorization"].split(" ")[1], process.env.JWT_KEY);
    if(decode.user.userName === request.body.userName)
    {
        return true;
    }
    response.status(400).send("Unauthorized request");
    return false;
}

module.exports = {
    verifyToken, verifyUserIdentity
}