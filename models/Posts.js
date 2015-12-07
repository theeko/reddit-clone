var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
   title: String,
   link: String,
   upvotes: { type: Number, default: 0 },
   comments: [{ type: mongoose.Schema.Types.ObjectId, ref:"Comment"}]
});

PostSchema.methods = function(cb){
   this.upvotes += 1;
   this.save(cb);
};

mongoose.model("Post", PostSchema);