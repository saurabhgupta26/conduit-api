var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('slug');

var commentSchema = new Schema (
    {
        comment : {
            body: String,
            author : {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }
    }
)

module.exports = mongoose.model("Comment", commentSchema);