import dotenv from 'dotenv';
dotenv.config();
for (const key of ['DATABASE_URL','JWT_SECRET']) { if (!process.env[key]) { console.error(`Missing ${key}`); process.exit(1); } }
if (process.env.JWT_SECRET.length < 32) { console.error('JWT_SECRET must be at least 32 characters'); process.exit(1); }
export const env = {port:Number(process.env.PORT||5000),nodeEnv:process.env.NODE_ENV||'development',jwtSecret:process.env.JWT_SECRET,jwtExpiresIn:process.env.JWT_EXPIRES_IN||'7d',clientOrigins:(process.env.CLIENT_ORIGIN||'http://localhost:5173').split(',').map(x=>x.trim()),isProd:process.env.NODE_ENV==='production'};
