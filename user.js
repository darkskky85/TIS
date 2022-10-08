const { Schema, model, mongoose } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Places' }],
});


userSchema.methods.favorite = function(id){
  if(this.favorites.indexOf(id) === -1){
    this.favorites.push(id);
  }

  return this.save();
};

userSchema.methods.unfavorite = function(id){
  this.favorites.remove(id);
  return this.save();
};

userSchema.methods.isFavorite = function(id){
  return this.favorites.some(function(favoriteId){
    return favoriteId.toString() === id.toString();
  });
};

// Model
const User = model("User", userSchema);

module.exports = User;
