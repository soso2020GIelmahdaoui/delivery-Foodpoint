import jwt from 'jsonwebtoken'

export const verifyToken= (req,res,next) => {
  const token=req.cookies.token

  if(!token) return 
     res.status(401).json({success:false,message:"Unauthorized Token not provided"});

    try{
      const decoded=jwt.verify(token,"QrW-(qBd]dIvO42E:%zYV6z2B6-1^s(£;)j.ZO@o`Don@g{0")
      if(!decoded.userId) return res.status(400).json({success:false,message:"Invalid Token"})
      req.userId=decoded.userId
      next()
    }catch(error){
      console.error('Error while verifying token')
      return res.status(400).json({success:false,message:"Invalid Token"})
    }
  
}