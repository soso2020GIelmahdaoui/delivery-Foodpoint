import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.JWT_SECRET)

export const generateTokenAndSetCookie=(res,userId)=>{
  const token=jwt.sign({userId},'mysecretkey987654321',{
    expiresIn:"7d",
  }
)

  res.cookie("token",token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"strict",
    maxAge:7*24*60*60*1000,
  });
  return token;
}