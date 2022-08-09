const process = require('process')
const mongoose = require('mongoose')
const Person = require('./models/person')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const name = process.argv[3]
const number = process.argv[4]
const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    if (name != null && number != null) {
      const person = new Person({
        name: name,
        number: number
      })
      person.save().then(() => mongoose.connection.close())
    } else {
      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
    }
  })
  .catch((err) => console.log(err))