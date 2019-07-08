const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer  = require('multer');
const path = require('path');
const YandexCheckout = require('yandex-checkout')({shopId: '601734', secretKey: 'live_cZL8TN-trfms9wQpUvi5vZ1Av-obz7wCFpJHMvAGGGg'});

const asyncMiddleware = require('../helpers/asyncMiddleware');

// Load Models
require('../models/Day');
require('../models/Album');
require('../models/Pages');
require('../models/Item');
const Day = mongoose.model('day');
const Order = require('../models/Order');
const Pages = mongoose.model('pages');
const Item = mongoose.model('items');
const Welcome = mongoose.model('welcomes');
const Restaraunt = mongoose.model('restaraunts');
const Children = mongoose.model('childrens');
const Album = mongoose.model('albums');

// Helper for Checking Admin status
const {ensureAdmin} = require('../helpers/auth');

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage
})

router.get('/', ensureAdmin, asyncMiddleware(async (req, res)  => {
  res.render('admin/dashboard');
}));

// PROGRAM
router.get('/program', ensureAdmin, asyncMiddleware(async (req, res)  => {
  Day.find()
  .sort({day: 1})
  .then(days => {
    res.render('admin/program/program', {
      days: days
    });
  });
}));

router.get('/program/add', ensureAdmin, asyncMiddleware(async (req, res)  => {
  res.render('admin/program/program_add');
}));

router.get('/program/edit/:id', ensureAdmin, asyncMiddleware(async (req, res)  => {
  Day.findOne({
    _id: req.params.id
  })
  .then(day => {
    res.render('admin/program/program_edit', {
      day: day
    });
  });
}));

router.post('/program', ensureAdmin, upload.single('image'), (req, res, next) => {    
  // Check for checkbox   
  let isChildren;
  if(req.body.isChildren) {
    isChildren = true;
  } else {
    isChildren = false;
  }
  const newDay = {
    title: req.body.title,
    day: req.body.day,
    month: req.body.month,
    number: req.body.number,
    time: req.body.time,
    week_day: req.body.week_day,
    startDay: req.body.startDay,
    place: req.body.place,
    image: req.file.filename,
    thesis: req.body.thesis,
    isChildren: isChildren,
    description: req.body.body
  }
    
  new Day(newDay)
    .save()
    .then(day => {
      res.redirect('/admin/program')
    })
    .catch(err => console.log(err));
    });

router.put('/program/:id', ensureAdmin, upload.single('image'), (req, res) => {
  Day.findOne({
    _id: req.params.id
  })

  .then(day => {
    // Check for checkbox   
    let isChildren;
    if(req.body.isChildren) {
      isChildren = true;
    } else {
      isChildren = false;
    }
    // Check if there is a new image choosen
    if(typeof req.file === 'undefined') {
       day.image = day.image
    } else {
      day.image = req.file.filename
    }
    day.title = req.body.title,
    day.day = req.body.day,
    day.month = req.body.month,
    day.number = req.body.number,
    day.time = req.body.time,
    day.week_day = req.body.week_day,
    day.startDay = req.body.startDay,
    day.place = req.body.place,
    day.thesis = req.body.thesis,
    day.isChildren = isChildren,
    day.description = req.body.body

    day.save()
      .then(day => {
        res.redirect('/admin/program')
    });
  });
});

// ALBUMS
router.get('/albums', ensureAdmin, asyncMiddleware(async (req, res)  => {
  Album.find()
    .then(albums => {
      res.render('admin/albums/admin_all', {
        albums: albums
      });
    });
}));

router.get('/album/add', ensureAdmin, asyncMiddleware(async (req, res)  => {
  res.render('admin/albums/album_add');
}));

router.post('/albums', ensureAdmin, upload.array('images'), (req, res, next) => {
      let obj = req.files;
      let imagesObj = obj.map((image) => {
        return {
          'image': image.filename
        }
      });

      const newAlbum = {
        title: req.body.title,
        year: req.body.year,
        images: imagesObj
      }
    
      new Album(newAlbum)
        .save()
        .then(() => {
          res.redirect('/admin/albums')
        })
        .catch(err => console.log(err));
});

router.delete('/album/:id', ensureAdmin, (req, res) => {
  Album.deleteOne({
    _id: req.params.id
  })
  .then(() => {
    res.redirect('/admin/albums');
  });
});

// PAGES

// GET ALL PAGES IN PAN
router.get('/pages', ensureAdmin, asyncMiddleware(async (req, res)  => {
  Pages.find()
  .populate('children')
  .populate('welcome')
  .populate('restaraunt')
  .then(pages => {
    res.render('admin/pages/index', {
      pages: pages
    })
  })
}));

const pagesUpload = upload.fields([
  {
    name: 'bgImage',
    maxCount: 1
  },
  {
    name: 'banners',
    maxCount: 4
  },
  {
    name: 'gallery'
  },
  {
    name: 'single-image',
    maxCount: 1
  }  
]);

// PAGES : WELCOME
router.get('/pages/edit/welcome/:id', ensureAdmin, asyncMiddleware(async (req, res)  => {
  Welcome.findOne({
    _id: req.params.id
  })
  .then(welcome => {
    res.render('admin/pages/edit/edit_welcome', {
      welcome: welcome
    });
  });
})); 

router.put('/pages/welcome/:id', ensureAdmin, pagesUpload, (req, res, next) => {
  Welcome.findOne({
    _id: req.params.id
  })
  .then(welcome => {
    console.log(typeof req.files['banners']);
    if(typeof req.files['bgImage'] === 'undefined') {
      welcome.image = welcome.image
    } else {
      let images = req.files['bgImage'];
      let imagesObj = images.map((image) => {
        return {
          'image': image.filename
        }
      })  
      welcome.image = imagesObj;
    }

    if(typeof req.files['banners'] === 'undefined') {
      welcome.banners = welcome.banners
    } else {
      let banners = req.files['banners'];
      let bannersObj = banners.map((image) => {
        return {
          'image': image.filename
        }
      })
      welcome.banners = bannersObj;
    }

    welcome.title = req.body.title;
    welcome.time = req.body.time;
    welcome.save()
      .then(welcome => {
        res.redirect('/admin/pages')
      })    
      .catch(err => console.log(err))
  })
});

// PAGES : CHILDREN

router.get('/pages/edit/children/:id', ensureAdmin, asyncMiddleware(async (req, res)  => {
  Children.findOne({
    _id: req.params.id
  })
  .then(children => {
    res.render('admin/pages/edit/edit_children', {
      children: children
    });
  });
})); 

router.put('/pages/children/:id', ensureAdmin, pagesUpload, (req, res) => {
  Children.findOne({
    _id: req.params.id
  })
  .then(children => {
    let banners = req.files['banners'];
    if(typeof banners === 'undefined') {
      children.banners = children.banners
    } else {
      let bannersObj = banners.map((image) => {
        return {
          'image': image.filename
        }
      })
      children.banners = bannersObj;
    }

    children.title = req.body.title;
    children.contest = req.body.body;

    children.save()
      .then(children => {
        res.redirect('/admin/pages')
      }) 
      .catch(err => console.log(err))
  });
});

// PAGES : RESTARAUNT

router.get('/pages/edit/restaraunt/:id', ensureAdmin, asyncMiddleware(async (req, res)  => {
  Restaraunt.findOne({
    _id: req.params.id
  })
  .then(restaraunt => {
    res.render('admin/pages/edit/edit_restaraunt', {
      restaraunt: restaraunt
    });
  });
})); 

router.put('/pages/restaraunt/:id', ensureAdmin, pagesUpload, (req, res) => {
  Restaraunt.findOne({
    _id: req.params.id
  })
  .then(restaraunt => {
    let banners = req.files['banners'];
    if(typeof banners === 'undefined') {
      restaraunt.banners = restaraunt.banners
    } else {
      let bannersObj = banners.map((image) => {
        return {
          'image': image.filename
        }
      });
      restaraunt.banners = bannersObj;
    }

    restaraunt.title = req.body.title;

    restaraunt.save()
      .then(restaraunt => {
        res.redirect('/admin/pages')
      }) 
      .catch(err => console.log(err))
  });
});

router.get('/pages/restaraunt/renters', ensureAdmin, (req, res) => {
  Restaraunt.find()
  .then(restaraunt => {
    res.render('admin/pages/all/renters_all', {
      restaraunt: restaraunt
    })
  })
});

// PAGES : RESTARAUNT : ADD RENTER
router.get('/pages/add/restaraunt/renter/:id', ensureAdmin, (req, res) => {
  Restaraunt.findOne({
    _id: req.params.id
  }).then(restaraunt => {
    res.render('admin/pages/add/renter', {
      restaraunt: restaraunt
    })
  });
});

router.post('/pages/restaraunt/renter/:id', ensureAdmin, upload.single('image'), (req, res) => {
  Restaraunt.findOne({
    _id: req.params.id
  })
    .then(restaraunt => {      
      const newRenter = {
        title: req.body.title,
        link: req.body.link,
        image: req.file.filename,
        items: req.body.items.split(',')
      }
      restaraunt.renters.unshift(newRenter);
      restaraunt.save()
      .then(restaraunt => res.redirect('/admin/pages'))
      .catch(err => console.log(err));
    });
});

// PAGES : RESTARAUNT : DELETE RENTER

router.delete('/restaraunt/renter/:id/:ren_id', ensureAdmin, (req, res) => {
  Restaraunt.findOne({
    _id: req.params.id
  })
  .then(restaraunt => {
    const removeIndex = restaraunt.renters.map(item => item.id).indexOf(req.params.ren_id);

    restaraunt.renters.splice(removeIndex, 1);

    restaraunt.save()
    .then(restaraunt => res.redirect('/admin/pages'))
    .catch(err => console.log(err));
  })
});

// SHOP
router.get('/shop', ensureAdmin, (req, res) => {
  Item.find()
  .then(items => {
    res.render('admin/shop/shop', {
      items: items
    });
  });
});

router.get('/shop/add', ensureAdmin, (req, res) => {
  res.render('admin/shop/add_item');
});

router.get('/shop/edit/:id', (req, res) => {
  Item.findOne({
    _id: req.params.id
  })
  .then(item => {
    res.render('admin/shop/edit_item', {
      item: item
    })
  });
});

router.post('/shop', ensureAdmin, upload.single('image'), ensureAdmin, (req, res) => {
  console.log(typeof req.body.sizes);
  let sizesObj;
  if(typeof req.body.sizes === 'undefined') {
    sizesObj = null;
  } else {
    let sizes = req.body.sizes.split(',');
    sizesObj = sizes.map((size) => {
      return {
        'size': size
      }
    });
  }
  const newItem = {
    title: req.body.title,
    price: req.body.price,
    image: req.file.filename,
    thesis: req.body.thesis,
    size: sizesObj
  }  

  new Item(newItem)
    .save()
    .then(item => {
      res.redirect('/admin/shop')
    })
    .catch(err => console.log(err))
});

router.put('/shop/:id', ensureAdmin, upload.single('image'), ensureAdmin, (req, res) => {
  Item.findOne({
    _id: req.params.id
  })
  .then(item => {
    console.log(typeof req.body.sizes);
    let sizes = req.body.sizes.split(',');
    let sizesObj = sizes.map((size) => {
      return {
        'size': size
      }
    }); 
    if(typeof req.file === 'undefined') {
      item.image = item.image
    } else {
      item.image = req.file.filename
    }
    item.title = req.body.title;
    item.price = req.body.price;    
    item.thesis = req.body.thesis;
    item.size = sizesObj
    item.save()
    .then(() => {
      res.redirect('/admin/shop')
    })
  })
});

router.delete('/shop/:id', ensureAdmin, (req, res) => {
  Item.deleteOne({
    _id: req.params.id
  })
  .then(() => {
    res.redirect('/admin/shop');
  });
});

router.get('/orders', ensureAdmin, async(req, res) => {
  const orders = await Order.find().sort({date:'desc'});

  await res.render('admin/orders/all', {
    orders: orders
  });
});

router.get('/order/:id', ensureAdmin, async(req, res) => {
  const order = await Order.findOne({_id: req.params.id});
  const paymentId = order.payment_id;
  const idempotenceKey = order.idempotenceKey;

  YandexCheckout.getPayment(paymentId, idempotenceKey)
  .then((result) => {
    res.render('admin/orders/single', {
      order: order,
      payment: result
    });
  })
  .catch(function(err) {
    console.error(err);
  });
});

router.delete('/order/:id', ensureAdmin, async(req, res) => {
  await Order.deleteOne({_id: req.params.id});
  await res.redirect('/admin/orders');
});

module.exports = router;