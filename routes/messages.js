const express = require('express');
const router = express.Router();
const {validate} = require('express-validation');
const { valid } = require('joi');

const checkAuth = require('../middleware/check-auth');
const protect = require('../middleware/protected')

const messageControlles = require('../controllers/messageController');
const messageValidation = require('../validators/messageValid')

/**
 * @swagger
 * components:
 *  schemas:
 *      Messages:
 *          type: object
 *          required: 
 *              - name
 *              - email
 *              - message
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the message
 *              name:
 *                  type: string
 *                  description: The name of the message sender
 *              email:
 *                  type: string
 *                  description: The email of the message sender
 *              message:
 *                  type: string
 *                  description: The name of the message sender
 *              date:
 *                  type: string
 *                  description: The auto-generated date of the day message sended
 *          example:
 *              name: jules kalisa
 *              email: juleska@gmail.com
 *              message: this is good thing
 *                  
 */

/**
 * @swagger
 * tags:
 *      name: Message
 *      description: messages from contact me
 */

/**
 * @swagger
 * /api/v1/messages:
 *    get:
 *       summary: get the messages
 *       tags: [Message]
 *       responses:
 *          200: 
 *              description: get all the messages from contact users
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                            $ref: '#/components/schemas/Messages'
 *          403:
 *              description: Access denied Forbidden
 */

/**
 * @swagger
 * /api/v1/messages/{id}:
 *    get:
 *      summary: get specific message by id
 *      tags: [Message]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The message id
 *      responses:
 *          200: 
 *            description: the specific message by id
 *            content:
 *              application/json: 
 *                  schema: 
 *                      $ref: '#/components/schemas/Messages'
 *          403:
 *            description: Access denied Forbidden
 *          404:
 *            description: Not found
 *        
 */

/**
 * @swagger
 * /api/v1/messages:
 *     post: 
 *        summary: create a message from users
 *        tags: [Message]
 *        requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Messages'
 *        responses:
 *                 200: 
 *                    description: message sent successfully
 *                    content:
 *                          application/json: 
 *                              schema:
 *                                  $ref: '#/components/schemas/Messages'
 *                 500:
 *                    description: failed 
 * 
 *                  
 */

/**
 * @swagger
 * /api/v1/messages/{id}:
 *      delete:
 *          summary: Remove message from the db
 *          tags: [Message]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                    type: string
 *                required: true
 *                description: message id to delete
 *          responses: 
 *              200: 
 *                description: the message deleted successful
 *              404: 
 *                description: the message not found
 *              403:
 *                description: Access denied Forbidden
 *
 */


router.route('/')
    .post(validate(messageValidation.messageVal), messageControlles.messagePost)
    .get([checkAuth,protect], messageControlles.messageGet)

router.route('/:messageId')
    .get([checkAuth,protect], messageControlles.getOneMessage)
    .delete([checkAuth,protect], messageControlles.messageDelete)



module.exports = router;