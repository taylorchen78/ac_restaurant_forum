const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()

const PORT = 3000

app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  db.sequelize.sync()
  console.log(`App listening on port ${PORT}`)
})

require('./routes')(app)