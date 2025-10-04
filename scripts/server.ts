import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint to trigger the script N times
app.post("/run-register", async (req, res) => {
  const count = Number(req.query.count) || 1;

  console.log(`Running register.ts ${count} times...`);

  for (let i = 0; i < count; i++) {
    exec("npx ts-node scripts/registration/register.ts", (error, stdout, stderr) => {
      if (error) {
        console.error(`Run ${i + 1} failed:`, error);
      } else {
        console.log(`Run ${i + 1} success:`, stdout);
      }
    });
  }

  res.json({ status: "ok", runs: count });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});