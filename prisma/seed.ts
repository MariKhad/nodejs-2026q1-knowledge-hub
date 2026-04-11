import { PrismaClient, Role, ArticleStatus } from './generated/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed starts...');

  const hashedPassword = await bcrypt.hash('Password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      login: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  
  const editor = await prisma.user.upsert({
    where: { login: 'editor' },
    update: {},
    create: {
      login: 'editor',
      password: hashedPassword,
      role: Role.EDITOR,
    },
  });
  
  const viewer = await prisma.user.upsert({
    where: { login: 'viewer' },
    update: {},
    create: {
      login: 'viewer',
      password: hashedPassword,
      role: Role.VIEWER,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Technology' },
      update: {},
      create: {
        name: 'Technology',
        description: 'Articles about latest tech trends and programming',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        description: 'Health, wellness, and personal development',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Business' },
      update: {},
      create: {
        name: 'Business',
        description: 'Entrepreneurship, marketing, and finance',
      },
    }),
  ]);

  const tagNames = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AI', 'Startup', 'Marketing'];
  const tags = await Promise.all(
    tagNames.map(name =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const article1 = await prisma.article.create({
    data: {
      title: 'Getting Started with TypeScript in 2024',
      content: 'TypeScript is a powerful superset of JavaScript that adds static typing. This guide covers the basics and why you should use it.',
      status: ArticleStatus.PUBLISHED,
      author: { connect: { id: admin.id } },
      category: { connect: { id: categories[0].id } },
      tags: {
        connect: [
          { id: tags.find(t => t.name === 'TypeScript')!.id },
          { id: tags.find(t => t.name === 'JavaScript')!.id },
        ],
      },
    },
  });
  
  const article2 = await prisma.article.create({
    data: {
      title: '10 Tips for Bootstrapping Your Startup',
      content: 'Learn how to build a successful startup with minimal funding. Focus on cash flow, MVP, and reinvesting profits.',
      status: ArticleStatus.PUBLISHED,
      author: { connect: { id: editor.id } },
      category: { connect: { id: categories[2].id } },
      tags: {
        connect: [
          { id: tags.find(t => t.name === 'Startup')!.id },
          { id: tags.find(t => t.name === 'Marketing')!.id },
        ],
      },
    },
  });
  
  const article3 = await prisma.article.create({
    data: {
      title: 'Building Scalable APIs with Node.js',
      content: 'Best practices for building scalable APIs including error handling, authentication, and database optimization.',
      status: ArticleStatus.DRAFT,
      author: { connect: { id: admin.id } },
      category: { connect: { id: categories[0].id } },
      tags: {
        connect: [
          { id: tags.find(t => t.name === 'Node.js')!.id },
          { id: tags.find(t => t.name === 'JavaScript')!.id },
        ],
      },
    },
  });
  
  const article4 = await prisma.article.create({
    data: {
      title: 'Digital Detox: Finding Balance',
      content: 'Learn practical strategies for disconnecting from technology and finding work-life balance.',
      status: ArticleStatus.PUBLISHED,
      author: { connect: { id: viewer.id } },
      category: { connect: { id: categories[1].id } },
      tags: {
        connect: [],
      },
    },
  });
  
  const article5 = await prisma.article.create({
    data: {
      title: 'The Rise of AI in Web Development',
      content: 'How AI tools are changing web development through code generation and testing automation.',
      status: ArticleStatus.ARCHIVED,
      author: { connect: { id: editor.id } },
      category: { connect: { id: categories[0].id } },
      tags: {
        connect: [
          { id: tags.find(t => t.name === 'AI')!.id },
          { id: tags.find(t => t.name === 'React')!.id },
        ],
      },
    },
  });
  
  const article6 = await prisma.article.create({
    data: {
      title: 'Content Marketing Strategies 2024',
      content: 'Proven content marketing tactics including video optimization, personalization, and community building.',
      status: ArticleStatus.PUBLISHED,
      author: { connect: { id: admin.id } },
      category: { connect: { id: categories[2].id } },
      tags: {
        connect: [
          { id: tags.find(t => t.name === 'Marketing')!.id },
        ],
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Great article! Very helpful for beginners.',
      article: { connect: { id: article1.id } },
      author: { connect: { id: viewer.id } },
    },
  });
  
  await prisma.comment.create({
    data: {
      content: 'Excellent tips! Thanks for sharing.',
      article: { connect: { id: article2.id } },
      author: { connect: { id: admin.id } },
    },
  });
  
  await prisma.comment.create({
    data: {
      content: 'This really resonated with me!',
      article: { connect: { id: article4.id } },
      author: { connect: { id: editor.id } },
    },
  });
  
  await prisma.comment.create({
    data: {
      content: 'Would love to see more examples!',
      article: { connect: { id: article6.id } },
      author: { connect: { id: viewer.id } },
    },
  });
  
  await prisma.comment.create({
    data: {
      content: 'Very informative, thank you!',
      article: { connect: { id: article1.id } },
      author: { connect: { id: editor.id } },
    },
  });

  console.log('Seed succeeded!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });