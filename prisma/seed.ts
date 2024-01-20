import { PrismaClient } from '@prisma/client';
import "process";

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  const category1 = await prisma.category.create({
    data: { categoryName: 'General Discussion', description: 'Talk about anything here' },
  });

  const category2 = await prisma.category.create({
    data: { categoryName: 'Tech Talk', description: 'Discuss tech-related topics' },
  });

  // Seed User
  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'johndoe',
      passwordHash: 'hashedpassword', // Remember to hash passwords in real applications
      registrationDate: new Date(),
      lastLoginDate: new Date(),
      isAdmin: false,
    },
  });

  // Seed Threads
  const thread1 = await prisma.thread.create({
    data: {
      title: 'Welcome to the Forum',
      isPinned: true,
      categoryId: category1.categoryId,
      userId: user1.userId,
    },
  });

  // Seed Posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Hello, everyone! Welcome to the new forum.',
      threadId: thread1.threadId,
      userId: user1.userId,
    },
  });

  // Seed Replies
  await prisma.post.create({
    data: {
      content: 'Thanks for the welcome!',
      userId: user1.userId,
      threadId: thread1.threadId,
      replyToId: post1.postId,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
