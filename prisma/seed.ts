import { prisma } from "../src/lib/prisma.ts";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const students = [
  // Basic 1
  { fullName: "John Doe", email: "john.doe@student.com", className: "Basic 1" },
  { fullName: "Jane Smith", email: "jane.smith@student.com", className: "Basic 1" },
  { fullName: "Michael Brown", email: "michael.brown@student.com", className: "Basic 1" },
  { fullName: "Emily Davis", email: "emily.davis@student.com", className: "Basic 1" },
  { fullName: "Daniel Wilson", email: "daniel.wilson@student.com", className: "Basic 1" },
  { fullName: "Sophia Taylor", email: "sophia.taylor@student.com", className: "Basic 1" },
  { fullName: "James Anderson", email: "james.anderson@student.com", className: "Basic 1" },
  { fullName: "Olivia Thomas", email: "olivia.thomas@student.com", className: "Basic 1" },
  { fullName: "Ethan Jackson", email: "ethan.jackson@student.com", className: "Basic 1" },
  { fullName: "Ava White", email: "ava.white@student.com", className: "Basic 1" },

  // Basic 2
  { fullName: "Liam Harris", email: "liam.harris@student.com", className: "Basic 2" },
  { fullName: "Emma Martin", email: "emma.martin@student.com", className: "Basic 2" },
  { fullName: "Noah Garcia", email: "noah.garcia@student.com", className: "Basic 2" },
  { fullName: "Isabella Martinez", email: "isabella.martinez@student.com", className: "Basic 2" },
  { fullName: "Mason Robinson", email: "mason.robinson@student.com", className: "Basic 2" },
  { fullName: "Mia Clark", email: "mia.clark@student.com", className: "Basic 2" },
  { fullName: "Logan Rodriguez", email: "logan.rodriguez@student.com", className: "Basic 2" },
  { fullName: "Charlotte Lewis", email: "charlotte.lewis@student.com", className: "Basic 2" },
  { fullName: "Lucas Lee", email: "lucas.lee@student.com", className: "Basic 2" },
  { fullName: "Amelia Walker", email: "amelia.walker@student.com", className: "Basic 2" },

  // Basic 3
  { fullName: "Aiden Hall", email: "aiden.hall@student.com", className: "Basic 3" },
  { fullName: "Harper Allen", email: "harper.allen@student.com", className: "Basic 3" },
  { fullName: "Jackson Young", email: "jackson.young@student.com", className: "Basic 3" },
  { fullName: "Evelyn Hernandez", email: "evelyn.hernandez@student.com", className: "Basic 3" },
  { fullName: "Sebastian King", email: "sebastian.king@student.com", className: "Basic 3" },
  { fullName: "Abigail Wright", email: "abigail.wright@student.com", className: "Basic 3" },
  { fullName: "Matthew Lopez", email: "matthew.lopez@student.com", className: "Basic 3" },
  { fullName: "Emily Hill", email: "emily.hill@student.com", className: "Basic 3" },
  { fullName: "Henry Scott", email: "henry.scott@student.com", className: "Basic 3" },
  { fullName: "Elizabeth Green", email: "elizabeth.green@student.com", className: "Basic 3" },

  // Basic 4
  { fullName: "Alexander Adams", email: "alexander.adams@student.com", className: "Basic 4" },
  { fullName: "Sofia Baker", email: "sofia.baker@student.com", className: "Basic 4" },
  { fullName: "Benjamin Gonzalez", email: "benjamin.gonzalez@student.com", className: "Basic 4" },
  { fullName: "Victoria Nelson", email: "victoria.nelson@student.com", className: "Basic 4" },
  { fullName: "William Carter", email: "william.carter@student.com", className: "Basic 4" },
  { fullName: "Grace Mitchell", email: "grace.mitchell@student.com", className: "Basic 4" },
  { fullName: "Elijah Perez", email: "elijah.perez@student.com", className: "Basic 4" },
  { fullName: "Chloe Roberts", email: "chloe.roberts@student.com", className: "Basic 4" },
  { fullName: "Owen Turner", email: "owen.turner@student.com", className: "Basic 4" },
  { fullName: "Penelope Phillips", email: "penelope.phillips@student.com", className: "Basic 4" },

  // Basic 5
  { fullName: "Jack Campbell", email: "jack.campbell@student.com", className: "Basic 5" },
  { fullName: "Layla Parker", email: "layla.parker@student.com", className: "Basic 5" },
  { fullName: "Ryan Evans", email: "ryan.evans@student.com", className: "Basic 5" },
  { fullName: "Zoe Edwards", email: "zoe.edwards@student.com", className: "Basic 5" },
  { fullName: "Nathan Collins", email: "nathan.collins@student.com", className: "Basic 5" },
  { fullName: "Nora Stewart", email: "nora.stewart@student.com", className: "Basic 5" },
  { fullName: "Dylan Sanchez", email: "dylan.sanchez@student.com", className: "Basic 5" },
  { fullName: "Lily Morris", email: "lily.morris@student.com", className: "Basic 5" },
  { fullName: "Isaac Rogers", email: "isaac.rogers@student.com", className: "Basic 5" },
  { fullName: "Hannah Reed", email: "hannah.reed@student.com", className: "Basic 5" },
];

async function main() {
  const classes = await prisma.classes.findMany();
  if (classes.length === 0) throw new Error("No classes found. Run class seed first.");

  const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);

  for (const s of students) {
    const cls = classes.find((c) => c.name === s.className);
    if (!cls) continue;

    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        fullName: s.fullName,
        email: s.email,
        password: hashedPassword,
        role: "student",
      },
    });

    await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        classId: cls.id,
      },
    });

    console.log(`✅ Seeded student: ${s.fullName} → ${s.className}`);
  }

  console.log("✅ All students seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });