const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://akaphamd5:${password}@cluster0.3pu6g.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
    
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    })
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
} else {
    // Uses find method of the Person model defined above to retrieve each object from the database since the param is {}
    Person.find({}).then(result => { 
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })

}

