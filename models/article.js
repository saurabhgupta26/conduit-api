var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('slug');

var articleSchema = new Schema (
    {
        slug : {
            type: String, 
            // required : true,
            lowercase:true,
            unique:true
        },
        title : {
            type: String, 
            required : true
        },
        description : {
            type : String,
            required: true
        },
        body : String,
        tagList : [ {
            type : String,
            required : true
        }],
        favourited : [ {
            type : Schema.Types.ObjectId,
            ref : "Article"
        }],
        favouritesCount :{
            type : Number,
            default : 0
        },
        author : {
            type : Schema.Types.ObjectId,
            ref: "User", 
            required: true
        } 
    }, {
        timestamps : true
    }
);

articleSchema.pre("save", function(next) {
    if(this.title && this.isModified("title")) {
        let slugged = slug(this.title, {lower: true});
        this.slug = slugged;
        next();
    }
    next();
});

module.exports = mongoose.model("Article", articleSchema);