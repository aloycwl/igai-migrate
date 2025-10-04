import express from 'express'
import main from './registration/register'

const app = express()
const PORT = process.env.PORT || 3000

// Endpoint to trigger the script N times
app.post('/run-register', async (req, res) => {
  console.log('POST /run-register hit')

  const count = Number(req.query.count) || 1
  console.log(`Running register.ts ${count} times...`)

  for (let i = 0; i < count; i++) {
    try {
      console.log(`Starting run ${i + 1}`)
      await main()
      console.log(`Run ${i + 1} success`)
    } catch (err) {
      console.error(`Run ${i + 1} failed`, err)
    }
  }

  res.json({ status: 'ok', runs: count })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
