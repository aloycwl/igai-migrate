import express from 'express'
import main from './registration/register'

const app = express()

// Endpoint to trigger the script N times
app.post('/run-register', async (req, res) => {
  const count = Number(req.query.count) || 1

  console.log(`Running register.ts ${count} times...`)

  for (let i = 0; i < count; i++) {
    try {
      await main()
      console.log(`Run ${i + 1} success`)
    } catch (err) {
      console.error(`Run ${i + 1} failed`, err)
    }
  }

  res.json({ status: 'ok', runs: count })
})

app.listen(PORT, () => {
  console.log(`Server running`)
})
