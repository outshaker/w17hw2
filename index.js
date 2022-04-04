const express = require('express')
const app = express()
const port = 3000

const weight_table = [1, 4, 6, 8, 1] // same as [5, 20, 30, 40, 5]
const _map = ["FIRST", "SECOND", "THIRD", "NONE", "ERROR"]
// console.log("weight_table", weight_table)

const make_drawer = (weight_table) => {
  const progressive_table = ((weight_table) => {
    let progressive_table = []
    progressive_table[0] = weight_table[0]
    for(let i = 1; i < weight_table.length; i++) {
      progressive_table[i] = progressive_table[i-1] + weight_table[i]
    }
    return progressive_table
  })(weight_table)
  // console.log("progressive_table", progressive_table)

  return () => {
    const total_number = progressive_table[progressive_table.length - 1]
    // console.log(total_number)
    const r = Math.random() * total_number
    for(let i = 0; i < progressive_table.length; i++) {
      if (i == 0 && r < progressive_table[0]) {
        // console.log(0, r, progressive_table[0])
        return 1
      } else if (progressive_table[i] <= r && r < progressive_table[i + 1]) {
        // console.log(progressive_table[i], r, progressive_table[i + 1])
        return i + 2
      }
    }
  }
}

const draw = make_drawer(weight_table)
// console.log(draw())

app.get('/test/lottery/:id', (req, res) => {
  if (req.params.id < 1 || req.params.id > _map.length) {
    res.status(404).send()
    return
  }
  const prize = {
    "prize": _map[req.params.id - 1]
  }
  if (prize.prize === "ERROR") {
    res.status(500).send()
    return
  }
  console.log("prize", prize)
  res.send(prize)
})

app.get('/lottery', (req, res) => {
  const prize = {
    "prize": _map[draw() - 1]
  }
  if (prize.prize === "ERROR") {
    res.status(500).send()
    return
  }
  console.log("prize", prize)
  res.send(prize)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})