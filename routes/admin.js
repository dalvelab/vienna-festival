const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer  = require('multer');
const path = require('path');

// Helper for Checking Admin status
const {ensureAdmin} = require('../helpers/auth');

const asyncMiddleware = require('../helpers/asyncMiddleware');

// Load Models
require('../models/Day');
const Day = mongoose.model('day');
require('../models/Pages');
const Pages = mongoose.model('pages');
const Welcome = mongoose.model('welcomes');
const Restaraunt = mongoose.model('restaraunts');
const Children = mongoose.model('childrens');
require('../models/Album');
const Album = mongoose.model('albums');

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

router.get('/', asyncMiddleware(async (req, res)  => {
  res.render('admin/dashboard');
}));

// PROGRAM
router.get('/program', asyncMiddleware(async (req, res)  => {
  Day.find()
  .then(days => {
    res.render('admin/program/program', {
      days: days
    });
  });
}));

router.get('/program/add', asyncMiddleware(async (req, res)  => {
  res.render('admin/program/program_add');
}));

router.get('/program/edit/:id', asyncMiddleware(async (req, res)  => {
  Day.findOne({
    _id: req.params.id
  })
  .then(day => {
    res.render('admin/program/program_edit', {
      day: day
    });
  });
}));

router.post('/program', upload.single('image'), (req, res, next) => {
      const newDay = {
        title: req.body.title,
        day: req.body.day,
        month: req.body.month,
        number: req.body.number,
        time: req.body.time,
        place: req.body.place,
        image: `uploads/${req.file.filename}`,
        thesis: req.body.thesis,
        description: req.body.body
      }
    
      new Day(newDay)
        .save()
        .then(day => {
          res.redirect('/admin/program')
        })
        .catch(err => console.log(err));
    });

router.put('/program/:id', upload.single('image'), (req, res) => {
  Day.findOne({
    _id: req.params.id
  })
  .then(day => {
        day.title = req.body.title,
        day.day = req.body.day,
        day.month = req.body.month,
        day.number = req.body.number,
        day.time = req.body.time,
        day.place = req.body.place,
        day.image = `uploads/${req.file.filename}`,
        day.thesis = req.body.thesis,
        day.description = req.body.body

        day.save()
        .then(day => {
          res.redirect('/admin/program')
        });
  });
});

// ALBUMS
router.get('/albums', asyncMiddleware(async (req, res)  => {
  Album.find()
    .then(albums => {
      res.render('admin/albums/admin_all', {
        albums: albums
      });
    });
}));

router.get('/album/add', asyncMiddleware(async (req, res)  => {
  res.render('admin/albums/album_add');
}));

router.post('/albums', upload.array('images'), (req, res, next) => {
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
        .then(album => {
          res.redirect('/admin/albums')
        })
        .catch(err => console.log(err));
});

// PAGES

// GET ALL PAGES IN PAN
router.get('/pages', asyncMiddleware(async (req, res)  => {
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
router.get('/pages/edit/welcome/:id', asyncMiddleware(async (req, res)  => {
  Welcome.findOne({
    _id: req.params.id
  })
  .then(welcome => {
    res.render('admin/pages/edit/edit_welcome', {
      welcome: welcome
    });
  });
})); 

router.put('/pages/welcome/:id', pagesUpload, (req, res, next) => {
  Welcome.findOne({
    _id: req.params.id
  })
  .then(welcome => {
    let banners = req.files['banners'];
    let bannersObj = banners.map((image) => {
      return {
        'image': image.filename
      }
    });

    let images = req.files['bgImage'];
    let imagesObj = images.map((image) => {
      return {
        'image': image.filename
      }
    });

    welcome.title = req.body.title;
    welcome.time = req.body.time;
    welcome.image = imagesObj;
    welcome.banners = bannersObj;

    welcome
      .save()
      .then(welcome => {
        res.redirect('/admin/pages')
      })    
      .catch(err => console.log(err))
  })
});

// PAGES : CHILDREN

router.get('/pages/edit/children/:id', asyncMiddleware(async (req, res)  => {
  Children.findOne({
    _id: req.params.id
  })
  .then(children => {
    res.render('admin/pages/edit/edit_children', {
      children: children
    });
  });
})); 

router.put('/pages/children/:id', pagesUpload, (req, res) => {
  Children.findOne({
    _id: req.params.id
  })
  .then(children => {
    let banners = req.files['banners'];
    let bannersObj = banners.map((image) => {
      return {
        'image': image.filename
      }
    });

    children.title = req.body.title;
    children.banners = bannersObj;

    children
      .save()
      .then(children => {
        res.redirect('/admin/pages')
      }) 
      .catch(err => console.log(err))
  });
});

router.get('/pages/add/children/program', (req, res) => {
  res.render('admin/pages/add/program')
});

// PAGES : RESTARAUNT

router.get('/pages/edit/restaraunt/:id', asyncMiddleware(async (req, res)  => {
  Restaraunt.findOne({
    _id: req.params.id
  })
  .then(restaraunt => {
    res.render('admin/pages/edit/edit_restaraunt', {
      restaraunt: restaraunt
    });
  });
})); 

router.put('/pages/restaraunt/:id', pagesUpload, (req, res) => {
  Restaraunt.findOne({
    _id: req.params.id
  })
  .then(restaraunt => {
    let banners = req.files['banners'];
    let bannersObj = banners.map((image) => {
      return {
        'image': image.filename
      }
    });

    restaraunt.title = req.body.title;
    restaraunt.banners = bannersObj;

    restaraunt
      .save()
      .then(restaraunt => {
        res.redirect('/admin/pages')
      }) 
      .catch(err => console.log(err))
  });
});

router.get('/pages/add/restaraunt/renter', (req, res) => {
  res.render('admin/pages/add/renter')
});


















// PAGES : TEST ROUTES 

// TEST ROUTE FOR CREATING PAGES
// router.get('/pages/add', (req, res) => {
//   res.render('admin/pages/add_pages');
// });

// TEST POST ROUTE (MUST BE REMOVED)
// router.post('/pages/restaraunt', pagesUpload, (req, res) => {
//   let banners = req.files['banners'];
//   let bannersObj = banners.map((image) => {
//     return {
//       'image': image.filename
//     }
//   });

//   const newRestaraunt = {
//     title: req.body.title,
//     banners: bannersObj
//   }

//   new Restaraunt(newRestaraunt)
//     .save()
//     .then(restaraunt => {
//       res.redirect('/admin/pages')
//     })
//     .catch(err => console.log(err));
// });

// JUST FOR CREATING PAGES COLLECTION
// router.post('/pages/pages', (req, res) => {
//   const newPages = {
//     children: '5cea524fb4f1710d8421c9d0',
//     welcome: '5ceaa833ae16961390640677',
//     restaraunt: '5ceaa959455b350a082bea0e'
//   } 
//   new Pages(newPages)
//     .save()
//     .then(pages => {
//       res.redirect('/admin/pages')
//     });
// });
module.exports = router;