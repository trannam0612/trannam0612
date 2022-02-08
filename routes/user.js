const express = require('express');

// const router = express.Router();
const router = require('express-promise-router')();



const UserController = require('../controller/user')
const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

// =================================
router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema), UserController.newUser)


router.route('/:userID/decks')
    .get(UserController.getUserDeck)
    .post(UserController.newUserDeck)


router.route('/:userID')
    .get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
    .put(validateBody(schemas.userSchema), validateParam(schemas.idSchema, 'userID'), UserController.replaceUser)
    .patch(UserController.updateUser)
// ===========================================
router.route('/signup')
    .post(validateBody(schemas.authSignUpSchema),UserController.signup)
router.route('/signin')
    .post(UserController.signin)
router.route('/secret')
    .get(UserController.secret)



module.exports = router