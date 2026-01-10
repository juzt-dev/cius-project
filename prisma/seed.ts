import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Default admin credentials
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ciuslabs.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✓ Admin user already exists: ${adminEmail}`);
    return;
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: 'admin',
      isActive: true,
    },
  });

  console.log(`✓ Created admin user: ${admin.email}`);
  console.log(`  ID: ${admin.id}`);
  console.log(`  Name: ${admin.name}`);
  console.log(`  Role: ${admin.role}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change the default admin password after first login!');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
