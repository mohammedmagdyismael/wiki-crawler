const express = require('express')
const router = express.Router()
const { check } = require('express-validator');

const sampleGET = require('./sample_controllers/get.controller')
const postSample = require('./sample_controllers/post.controller')
const samplePUT = require('./sample_controllers/put.controller')
const sampleDELETE = require('./sample_controllers/delete.controller')

 
//@access       Public
/**
 * @swagger
 * /api/sample:
 *  post:
 *      description: Use to sign up new user
 *      responses:
 *          '200':
 *              description: A successful sign up 3
 */

router.post('/',[
    check('name','name is required').not().isEmpty()
], (req,res,next)=>{postSample.postSample(req,res,next)})

//@route Get    /api/users
//@desc         Test Route
//@access       Public
/**
 * @swagger
 * /api/users:
 *  post:
 *      description: Use to sign up new user
 *      responses:
 *          '200':
 *              description: A successful sign up 3
 */

/* router.get('/',auth, (req,res,next)=>getAuth.getAuth(req,res,next) );
 */
// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
/* router.delete('/', auth, (req,res,next)=>deleteProfile.deleteProfile(req,res,next) );
 */
// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
/* router.put('/experience',
    [auth,
      [
        check('title', 'Title is required')
          .not()
          .isEmpty(),
        check('company', 'Company is required')
          .not()
          .isEmpty(),
        check('from', 'From date is required')
          .not()
          .isEmpty()
      ]
    ],
    (req,res,next)=>putProfile_experience.putExperience(req,res,next)
  );
 */
module.exports = router;