const mongoose = require("mongoose")
const Schema = mongoose.Schema
const uniqueValidator = require("mongoose-unique-validator")

let appSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "The name is required"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    category: [{
        type: String,
    }],
    version: {
        type: Number,
        required: true
    },
    updated: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    img: {
        type: String
    },
    screenshots: [{
        type: String
    }],
    code: {
        type: String
    },
    licence: {
        type: String
    },
    file: {
        type: String
    }
})

appSchema.plugin(uniqueValidator, {
    message: 'The {PATH} exists, use another name for your app'
})

module.exports = mongoose.model('App', appSchema)