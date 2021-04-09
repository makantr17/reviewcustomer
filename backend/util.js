import jwt from 'jsonwebtoken'
import config from './config'

const getToken = (user) =>{
    return jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }, 
            config.JWT_SECRET, 
        {
            expiresIn: '48h' 
        })
}

const getCompToken = (company) =>{
    return jwt.sign({
            _id: company._id,
            name: company.name,
            email: company.email,
            isAdmin: company.isAdmin,
        }, 
            config.JWT_COMPANY_SECRET, 
        {
            expiresIn: '48h' 
        })
}


const singupToken = (user) =>{
    return jwt.sign({
            name: user.name,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
        }, 
            config.JWT_SECRET_REGISTER, 
        {
            expiresIn: '20m' 
        })
}



const compSingupToken = (company) =>{
    return jwt.sign({
            userId: company.userId,
            name: company.name,
            email: company.email,
            password: company.password,
            isAdmin: company.isAdmin,
        }, 
            config.JWT_COMPANY_REGISTER, 
        {
            expiresIn: '20m' 
        })
}

const resetToken = (user) =>{
    return jwt.sign({
            _id: user
        }, 
            config.JWT_SECRET_RESET, 
        {
            expiresIn: '20m' 
        })
}

const serverLink=()=>{
    return config.CLIENT_URL
}


const logout = () =>{
    return jwt.sign({});
}


// signup


// authentification
const isAuth = (req, res, next)=>{
    const token = req.headers.authorization;
    if (token) {
        const onlyToken = token.slice(6, token.length);
        jwt.verify(onlyToken, config.JWT_SECRET, (err, decode)=>{
            if (err) {
                return res.status(401).send({msg: "invalid Token"});
            }
            req.user = decode;
            next();
            return
        });
    }else{
        return res.status(401).send({msg: "Token is not applied"}) ;
    }
}



const isAdmin = (req, res, next) =>{
    if(req.user && req.user.isAdmin){
        return next();
    }
    return res.status(401).send({msg: "Admin Token is not valid"});
}

export{
    getToken, isAuth, isAdmin, logout, singupToken, serverLink, resetToken, compSingupToken, getCompToken
}