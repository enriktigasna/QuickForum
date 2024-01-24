import { PrismaClient } from '@prisma/client';
import "process";

const prisma = new PrismaClient();

async function main() {
  // Seed Categories
  const categories = [
    { categoryName: 'Announcements', description: 'Announcements for the forum' },
    { categoryName: 'Tech Talk', description: 'Discuss tech-related topics' },
    { categoryName: 'General Discussion', description: 'Discuss anything' },
    { categoryName: 'Off-Topic', description: 'Discuss anything not related to tech' },
    { categoryName: 'Introductions', description: 'Introduce yourself to the community' },
    { categoryName: 'Feedback', description: 'Give feedback on the forum' },
  ];
  const createdCategories = await Promise.all(categories.map(async (category) => {
    return await prisma.category.create({
      data: category,
    });
  }));

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
      categoryId: createdCategories[0].categoryId,
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
