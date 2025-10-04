import express from 'express'
import main from './registration/register'

const app = express()

process.stdout.isTTY = true
process.stdin.isTTY = true

function log(...args: any[]) {
  console.log(...args)
  process.stdout.write("") // flush immediately
}

// Endpoint to trigger the script N times
app.post('/run-register', async (req, res) => {
  const count = Number(req.query.count) || 1

  log(`Running register.ts ${count} times...`)

  for (let i = 0; i < count; i++) {
    try {
      await main()
      console.log(`Run ${i + 1} success from server`)
    } catch (err) {
      console.error(`Run ${i + 1} failed`, err)
    }
  }

  res.json({ status: 'ok', runs: count })
})

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`)
})
