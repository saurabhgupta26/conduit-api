var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('slug');

var commentSchema = new Schema (
    {
        body : {
            type: String,
            required: true
        },
        author : {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        article: {
            type: Schema.Types.ObjectId,
            ref: 'Article'
        }
        }, {
        timestamps: true
    }
)

module.exports = mongoose.model("Comment", commentSchema);