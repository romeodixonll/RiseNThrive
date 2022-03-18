const { Schema, model } = require("mongoose");
const Task = require('./Task')
const Stat = require('./Stat')
const bcrypt = require("bcrypt");
const optionsSchema = require("./options");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  stats: [{
    type: Schema.Types.ObjectId,
    ref: 'Stat'
  }],

  savedOptions: [optionsSchema]

});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
