var express = require('express');
var router = express.Router();
var steem = require('steem');
var sendmail = require('sendmail')();
var db = require("../db");

steem.api.setOptions({ url: process.env.NODE_URL });
steem.config.set('address_prefix', process.env.ADDRESS_PREFIX);
steem.config.set('chain_id', process.env.CHAIN_ID);

var createUser = async (name, password) => {
  return new Promise((res, rej) => {
    var keysChain = steem.auth.generateKeys(name, password, ['owner','active','posting','memo']);

    var ownerAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysChain.owner, 1]]
    };
    var activeAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysChain.active, 1]]
    };
    var postingAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[keysChain.posting, 1]]
    };
  
    var memoKey = keysChain.memo;
    var ex = [];
  
    steem.broadcast.accountCreateWithDelegation(
      process.env.CREATOR_WIF,
      process.env.CREATOR_FEE,
      process.env.CREATOR_DELEGATION,
      process.env.CREATOR_NAME,
      name,
      ownerAuth,
      activeAuth,
      postingAuth,
      memoKey,
      {},
      ex,
    function(err, registration) {
      if (err) {
        return rej(err);
      }
      var privateKeys = steem.auth.getPrivateKeys(name, password, ["owner","active","posting","memo"]);
      res({
        registration,
        privateKeys,
        keysChain
      });
    });
  });
}

/* GET home page. */
router.get('/', (req, res, next) => {
  db.getRequests(req.app.locals.db, 0).then((requests) => {
    res.render('admin', { title: 'Admin page', requests: requests });
  }).catch(next); 
});

router.get('/approve/:id', function(req, res, next) {
  db.approveRequest(req.app.locals.db, parseInt(req.params.id)).then(() => {
    db.getRequest(req.app.locals.db, parseInt(req.params.id)).then((data) => {
      createUser(data.name, data.password).then((data) => {
        sendmail({
          from: process.env.FROM_MAILER,
          to: data.email,
          subject: process.env.SUBJECT_MAILER,
          html: `Registration success, your account ${data.name} is active. User your name and password for login to blockchain`,
        }, (err, reply) => {
          if(err) {
            return next(err);
          }
          res.redirect('/admin');
        })       
      }).catch(next);
    }).catch(next); 
  }).catch(next); 
});

router.get('/reject/:id', function(req, res, next) {
  db.rejectRequest(req.app.locals.db, parseInt(req.params.id)).then(() => {
    res.redirect('/admin');
  }).catch(next); 
});

module.exports = router;
