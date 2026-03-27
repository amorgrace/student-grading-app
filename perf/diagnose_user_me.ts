import "dotenv/config";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

// Setup Prisma client to test if it's the bottleneck
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function benchmark() {
  console.log("=== Diagnostics for /user/me slowness ===\n");

  // Step 1: Get a test user from database
  console.log("📍 Fetching a test user from database...");
  const t0 = Date.now();
  const testUser = await prisma.user.findFirst({
    select: { id: true, email: true, role: true },
  });
  const dbFetchTime = Date.now() - t0;
  console.log(`   DB fetch time: ${dbFetchTime}ms\n`);

  if (!testUser) {
    console.error("❌ No test user found in database");
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log(`✅ Found user: ${testUser.email} (id: ${testUser.id})\n`);

  // Step 2: JWT sign/verify timing
  console.log("📍 Testing JWT sign/verify performance...");
  const jwtSignStart = Date.now();
  const token = jwt.sign(
    { userId: testUser.id, role: testUser.role },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  const jwtSignTime = Date.now() - jwtSignStart;

  const jwtVerifyStart = Date.now();
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  const jwtVerifyTime = Date.now() - jwtVerifyStart;

  console.log(`   JWT sign: ${jwtSignTime}ms`);
  console.log(`   JWT verify: ${jwtVerifyTime}ms\n`);

  // Step 3: Simulate the exact /user/me query
  console.log("📍 Testing exact /user/me query (10 iterations)...");
  const queryTimes: number[] = [];
  for (let i = 0; i < 10; i++) {
    const queryStart = Date.now();
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    const queryTime = Date.now() - queryStart;
    queryTimes.push(queryTime);
    console.log(`   Query ${i + 1}: ${queryTime}ms`);
  }

  const avgQuery = Math.round(
    queryTimes.reduce((a, b) => a + b, 0) / queryTimes.length,
  );
  const minQuery = Math.min(...queryTimes);
  const maxQuery = Math.max(...queryTimes);

  console.log(
    `\n   Min: ${minQuery}ms | Avg: ${avgQuery}ms | Max: ${maxQuery}ms\n`,
  );

  // Step 4: Full /user/me simulation (protect middleware + controller)
  console.log(
    "📍 Full /user/me simulation (protect + controller, 5 iterations)...",
  );
  const fullTimes: number[] = [];
  for (let i = 0; i < 5; i++) {
    const fullStart = Date.now();

    // Simulate protect middleware: JWT verify
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      console.error("JWT verification failed");
      break;
    }

    // Simulate getMe controller: findUnique
    const user = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const fullTime = Date.now() - fullStart;
    fullTimes.push(fullTime);
    console.log(`   Full request ${i + 1}: ${fullTime}ms`);
  }

  const avgFull = Math.round(
    fullTimes.reduce((a, b) => a + b, 0) / fullTimes.length,
  );
  console.log(`\n   Average: ${avgFull}ms\n`);

  // Conclusion
  console.log("=== Summary ===");
  console.log(`Database fetch (cold): ${dbFetchTime}ms`);
  console.log(`Query avg (findUnique): ${avgQuery}ms`);
  console.log(`Full /user/me avg: ${avgFull}ms`);
  console.log(
    `\nIf full /user/me is ~${avgFull}ms but expected ~1120ms, database latency is likely the culprit.\n`,
  );

  await prisma.$disconnect();
}

benchmark().catch(console.error);
