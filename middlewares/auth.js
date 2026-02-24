import jwt from 'jsonwebtoken'

export const autenticar = (req,res,next) => {
    const token = req.headers.authorization?.replace("Bearer ","")
    console.log(token)

    if(!token){
        return res.status(401).json({message:"Token não fornecido!"})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch(error){
        res.status(401).json({message:"Token invalido!"})
    }
}