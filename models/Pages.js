const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChildrenSchema = new Schema({
  title: {
    type: String
  },
  banners: [{
    type: Object
  }],
  contest: {
    type: String
  }
});

const WelcomeSchema = new Schema({
  title: {
    type: String
  },
  time: {
    type: String
  },
  image: [{
    type: Object
  }],
  banners: [{
    type: Object
  }]
});

const RestarauntSchema = new Schema({
  title: {
    type: String
  },
  banners: [{
    type: Object
  }],
  renters: [{
    title: {
      type: String
    },
    link: {
      type: String
    },
    image: {
      type: String
    },
    items: {
      type: [String]
    }
  }]
})

const PagesSchema = new Schema({
  children: {
    type: Schema.Types.ObjectId,
    ref: 'childrens'
  },
  welcome: {
    type: Schema.Types.ObjectId,
    ref: 'welcomes'
  },
  restaraunt: {
    type: Schema.Types.ObjectId,
    ref: 'restaraunts'
  }
});

const Pages = mongoose.model('pages', PagesSchema);
const Welcome = mongoose.model('welcomes', WelcomeSchema);
const Children = mongoose.model('childrens', ChildrenSchema);
const Restaraunt = mongoose.model('restaraunts', RestarauntSchema);

module.exports = {
  Pages, Welcome, Children, Restaraunt
}