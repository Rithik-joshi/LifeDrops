import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(env.port, () => {
      console.log(`🚀 LifeDrops API running on http://localhost:${env.port}`);
      console.log(`   Environment: ${env.nodeEnv}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
