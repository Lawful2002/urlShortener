const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linksSchema = new Schema ({
    shortenedLink: {
        type: String,
        required: true,
        unique: true
    },
    redirectTo: {
        type: String,
        required: true,
        unique: true
    },
    dateCreated: {
        type: Date,
        required: true
    }
});

// linksSchema.index({shortenedLink: 1, redirectTo: 1});


module.exports = mongoose.model('link', linksSchema);
