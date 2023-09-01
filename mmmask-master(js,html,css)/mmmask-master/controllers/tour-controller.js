const Tour = require('../models/tour-model')

exports.create = async function (data) {
    return await Tour.create(data)
}

exports.getTours = async function () {
    return await Tour.find().populate('band').populate('concert').exec()
}

exports.getById = async function (id) {
    return await Tour.findById(id)
        .populate('band')
        .populate('tourDays.concert')
        .populate('tourDays.concert.venue')
        .populate('bruttoList')
        .exec()
}

exports.update = async function (id, data) {
    return await Tour.findByIdAndUpdate(id, data, { new: true }).exec()
}

exports.delete = async function (id) {
    return await Tour.findByIdAndDelete(id).exec()
}

exports.addConcert = async function (tourId, concertId) {
    // TODO: error handling
    const tour = await Tour.findById(tourId).exec()
    tour.tourDays.push({ concert: concertId })
    return await tour.save()
}
