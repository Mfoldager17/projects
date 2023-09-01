const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    band: {
        type: mongoose.ObjectId,
        ref: 'Band',
        required: true
    },
    tourDays: [
        {
            note: {
                type: String
            },
            date: {
                type: String
            },
            concert: {
                type: mongoose.ObjectId,
                ref: 'Concert'
            }
        }
    ],
    bruttoList: [
        {
            type: mongoose.ObjectId,
            ref: 'Venue'
        }
    ]
})

module.exports = mongoose.model('Tour', tourSchema)
