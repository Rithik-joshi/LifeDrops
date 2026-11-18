import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma=new PrismaClient();
async function main(){if(process.env.NODE_ENV==='production')throw new Error('Demo seed is disabled in production');const password=await bcrypt.hash('DemoPassword123!',12);for(const [i,name,bloodGroup,city,state] of [[1,'Aarav Sharma','O_POS','Mumbai','Maharashtra'],[2,'Priya Patel','A_POS','Mumbai','Maharashtra'],[3,'Rahul Verma','B_NEG','Delhi','Delhi']]){const user=await prisma.user.upsert({where:{email:`donor${i}@lifedrops.demo`},update:{},create:{email:`donor${i}@lifedrops.demo`,passwordHash:password,name}});await prisma.donorProfile.upsert({where:{userId:user.id},update:{},create:{userId:user.id,bloodGroup,city,state,isAvailable:true,isDiscoverable:true,preferredContact:'EMAIL'}});}console.log('Demo donors seeded (local development only)');}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>prisma.$disconnect());
