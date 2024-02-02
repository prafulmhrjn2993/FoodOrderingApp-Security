const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );


module.exports = mongoose.model("User", userSchema);