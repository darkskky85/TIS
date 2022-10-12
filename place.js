const {Schema, model, mongoose} = require("mongoose");
var User = mongoose.model('User');

const PlaceSchema=new Schema({
  title: String,
  description: String,
  image: String,
  region: String,
  favoritesCount: {type: Number, default: 0},
})


PlaceSchema.methods.updateFavoriteCount = function() {
  var article = this;

  return User.count({favorites: {$in: [article._id]}}).then(function(count){
    article.favoritesCount = count;

    return article.save();
  });
};

PlaceSchema.methods.toJSONFor = function(user){
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    image: this.image,
    region: this.region,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount
  };
};


// Model
const Place=model('Places',PlaceSchema)

module.exports = Place