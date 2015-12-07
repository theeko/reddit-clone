var mongoose = require("mongoose");

var CommentSchema = mongoose.Schema({
   body: String,
   author: String,
   upvotes: { type: Number, default: 0 },
   post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" } 
});

CommentSchema.methods = function(cb){
   this.upvotes += 1;
   this.save(cb);
};

mongoose.model("Comment", CommentSchema);