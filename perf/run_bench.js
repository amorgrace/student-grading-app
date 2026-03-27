const urls = ["http://localhost:3000/", "http://localhost:3000/api/classes"];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function hit(url, n = 10) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    const t0 = Date.now();
    try {
      const res = await fetch(url);
      const t = Date.now() - t0;
      console.log(`${url} ${i + 1}: ${t}ms status:${res.status}`);
      total += t;
    } catch (err) {
      console.log(`${url} ${i + 1}: error ${err.message}`);
    }
    await delay(200);
  }
  console.log(`${url} avg: ${Math.round(total / n)}ms\n`);
}

(async () => {
  for (const u of urls) {
    console.log("Running benchmarks for", u);
    await hit(u, 10);
  }
})();
