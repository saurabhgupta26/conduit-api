var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {hash, compare} = require('bcryptjs');

var userSchema = new Schema (
    {
        email : {
            type: String, 
            required : true,
            unique: true,
            lowercase: true,
            match: /@/
        },
        username : {
            type: String, 
            required : true,
            unique: true
        },
        password : {
            type : String,
            required: true
        },
        bio : String,
        image: String,
        following : [ {
            type : Schema.Types.ObjectId,
            ref : "User"
        }],
        followers : [ {
            type : Schema.Types.ObjectId,
            ref : "User"
        }]
    }, {
        timestamps : true
    }
);
userSchema.pre('save', async function(next) {
    try {
        if(this.password && this.isModified("password")) {
        this.password = await hash(this.password, 10);
        return next();
    }
        next();
    } catch (error) {
     next(error);
    }
});
userSchema.methods.verifyPassword = async function(password) {
    return await compare(password, this.password);
}
module.exports = mongoose.model("User", userSchema);