import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../config/prisma.js';
import { fail } from '../utils/response.js';
export const requireAuth=async(req,res,next)=>{try{const header=req.headers.authorization||'';const token=header.startsWith('Bearer ')?header.slice(7):null;if(!token)return fail(res,'Authentication required',401);const decoded=verifyToken(token);const user=await prisma.user.findUnique({where:{id:decoded.sub},select:{id:true,email:true,name:true,role:true}});if(!user)return fail(res,'User not found',401);req.user=user;next();}catch(err){if(err.name==='JsonWebTokenError'||err.name==='TokenExpiredError')return fail(res,'Invalid or expired token',401);next(err);}};
export const requireAdmin=(req,res,next)=>req.user?.role==='ADMIN'?next():fail(res,'Admin access required',403);
export const optionalAuth=async(req,res,next)=>{try{const header=req.headers.authorization||'';if(header.startsWith('Bearer ')){const decoded=verifyToken(header.slice(7));req.user=await prisma.user.findUnique({where:{id:decoded.sub},select:{id:true,email:true,name:true,role:true}});}}catch{}next();};
