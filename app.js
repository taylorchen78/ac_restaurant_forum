const express = require('express')
const handlebars = require('express-handlebars')
const app = express()

const PORT = 3000

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})