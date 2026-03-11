import { prisma } from "../src/lib/prisma.ts";


const subjects = [
  { name: "Mathematics" },
  { name: "English Language" },
  { name: "Basic Science" },
  { name: "Social Studies" },
  { name: "Civic Education" },
  { name: "Agricultural Science" },
  { name: "Computer Studies" },
  { name: "Physical Education" },
  { name: "Religious Studies" },
  { name: "Creative Arts" },
];

async function main() {
  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    });
  }
  console.log("✅ Subjects seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });