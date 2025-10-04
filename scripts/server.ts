import express from 'express'
import main from './registration/register'

const app = express()

// Endpoint to trigger the script N times
app.post('/run-register', async (req, res) => {

  const count = Number(req.query.count) || 1

  for (let i = 0; i < count; i++) {
    try {
      console.log(`Starting run ${i + 1}`)
      await main()
    } catch (err) {
      console.error(err)
    }
  }

  res.json({ status: 'ok', runs: count })
})

app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:3000`)
})
