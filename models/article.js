var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String

    },
    url: {
        type: String,
        required: true
    },

    isSaved: {
        type: Boolean,
        default: false
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

var Article = mongoose.model("article", ArticleSchema);

module.exports = Article;