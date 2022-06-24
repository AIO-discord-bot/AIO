const mongoose = require("mongoose");

const PremuimCodeSchema = new mongoose.Schema(
{
    code: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('PremuimCode', PremuimCodeSchema);