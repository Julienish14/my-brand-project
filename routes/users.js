const express = require('express');
const router = express.Router();
const {validate} = require('express-validation');
const { valid } = require('joi');

const usersController = require('../controllers/usersController');
const usersValidation = require('../validators/usersValid');
const checkAuth = require('../middleware/check-auth');
const protect = require('../middleware/protected')


/**
 * @swagger
 * components:
 *  schemas:
 *       Users:
 *          type: object
 *          required: 
 *              - full_name
 *              - email
 *              - password
 *              - date
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the user
 *              full_name:
 *                  type: string
 *                  description: full name of the sign up user
 *              email:
 *                  type: string
 *                  description: valid email of the user 
 *              password:
 *                  type: string
 *                  description: valid password of the user
 *              date:
 *                  type: string
 *                  description: The auto-generated date of the time sign up
 *          example:
 *              full_name: name my name
 *              email: email@gmail.com
 *              password: string
 *                  
 */


/**
 * @swagger
 * tags:
 *      name: User
 *      description: Users, signup, signin, and info
 */


/**
 * @swagger
 * /api/v1/users/signUp:
 *     post: 
 *        summary: user sign up 
 *        tags: [User]
 *        requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Users'
 *        responses:
 *                 200: 
 *                    description: user signup successfully
 *                    content:
 *                          application/json: 
 *                              schema:
 *                                  $ref: '#/components/schemas/Users'
 *                 500:
 *                    description: failed 
 * 
 *                  
 */

/**
 * @swagger
 * /api/v1/users/login:
 *     post: 
 *        summary: user sign in 
 *        tags: [User]
 *        requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Users'
 *        responses:
 *                 200: 
 *                    description: user sign in successfully
 *                    content:
 *                          application/json: 
 *                              schema:
 *                                  $ref: '#/components/schemas/Users'
 *                 500:
 *                    description: failed 
 * 
 *                  
 */


/**
 * @swagger
 * /api/v1/users/logout:
 *     post: 
 *        summary: user signout
 *        tags: [User]
 *        responses:
 *                 200: 
 *                    description: user logged out
 *                 500:
 *                    description: failed 
 * 
 *                  
 */



/**
 * @swagger
 * /api/v1/users:
 *    get:
 *       summary: get all users who signup
 *       tags: [User]
 *       responses:
 *          200: 
 *              description: get all users from who sign up as admin
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                            $ref: '#/components/schemas/Users'
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *    get:
 *      summary: get specific user by his/her id
 *      tags: [User]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The user id
 *      responses:
 *          200: 
 *            description: the specific user by id
 *            content:
 *              application/json: 
 *                  schema: 
 *                      $ref: '#/components/schemas/Users'
 *        
 */


/**
 * @swagger
 * /api/v1/users/{id}:
 *      patch:
 *          summary: update users profile
 *          tags: [User]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                    type: string
 *                required: true
 *                description: user id to update
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Users'
 *          responses: 
 *              200: 
 *                description: users profile updated successful
 *              404: 
 *                description: user not found
 *
 */


/**
 * @swagger
 * /api/v1/users/{id}:
 *      delete:
 *          summary: Remove user from the list of users
 *          tags: [User]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                    type: string
 *                required: true
 *                description: user's id to delete
 *          responses: 
 *              200: 
 *                description: the user deleted successful
 *              404: 
 *                description: user not found
 *
 */


//Create users or call it signUP 
router.route('/signUp').post(validate(usersValidation.createUpdateUser) ,usersController.signUp)

//Login
router.route('/login').post(usersController.login)
//Logout
 router.route('/logout').post(usersController.logout)

router.route('/')
//Show all users 
    .get([checkAuth,protect], usersController.getAllUsers);

router.route('/:userId')
//Get single specific user
    .get(usersController.getSpecificUser)

//Update the user
    .patch(validate(usersValidation.createUpdateUser), usersController.updateUser)

//Delete the user account
    .delete([checkAuth,protect], usersController.deleteUser);


module.exports = router; 
