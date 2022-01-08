const mongoose = require("mongoose")
let Schema = mongoose.Schema
const uniqueValidator = require("mongoose-unique-validator")

let validRoles = {
    values: ['Individual', 'Team'],
    message: '{VALUE} Is not a valid Role'
}

var userSchema = new Schema({
    publisher: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true, "The Username is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "The email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "The password is required"]
    },
    status: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: validRoles
    },
    apps: [{
        type: Schema.Types.ObjectId,
        ref: 'App'
    }],
    img: {
        type: String,
    },
    google: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject()
    delete userObject.password
    return userObject
}

userSchema.plugin(uniqueValidator, {
    message: 'The {PATH} should be unique'
})

module.exports = mongoose.model("User", userSchema)