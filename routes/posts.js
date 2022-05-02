const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const protect = require('../middleware/protected');

const postsController = require('../controllers/postsController');
const commentContro = require('../controllers/commentsController')

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req , file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, new Date().getTime()+ '-' + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};


const upload = multer({storage: storage, limits: {
    fileSize: 1024 * 1024 * 5    
  },
  fileFilter: fileFilter
});


/**
 * @swagger
 * components:
 *  schemas:
 *      Posts:
 *          type: object
 *          required: 
 *              - title
 *              - content
 *              - blogImage
 *              - date
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the post 
 *              title:
 *                  type: string
 *                  description: blog title 
 *              content:
 *                  type: string
 *                  description: the content of the article
 *              blogImage:
 *                  type: string
 *                  format: binary
 *                  description: image of the article
 *              date:
 *                  type: string
 *                  description: The auto-generated date of the created article
 *          example:
 *              title: this is my first blog article
 *              content: this is the context of my first blog article 
 *              blogImage: url image
 *                  
 */



/**
 * @swagger
 * components:
 *  schemas:
 *      Comments:
 *          type: object
 *          required: 
 *              - comment
 *          properties:
 *              comment:
 *                  type: string
 *                  description: write an comment on the article
 *          example:
 *              comment: this is my first blog article
 */


/**
 * @swagger
 * tags:
 *      name: article
 *      description: about articles 
 */

/**
 * @swagger
 *    tags: 
 *        name: comment & like
 *        description: comments and like on the article
 */

/**
 * @swagger
 * /api/v1/articles:
 *    get:
 *       summary: get the list of all articles
 *       tags: [article]
 *       responses:
 *          200: 
 *              description: get all the list of created article
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                            $ref: '#/components/schemas/Posts'
 */

/**
 * @swagger
 * /api/v1/articles/{id}:
 *    get:
 *      summary: get specific article by id
 *      tags: [article]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the article id
 *      responses:
 *          200: 
 *            description: the specific article by id
 *            content:
 *              application/json: 
 *                  schema: 
 *                      $ref: '#/components/schemas/Posts'
 *        
 */


/**
 * @swagger
 * /api/v1/articles:
 *     post: 
 *        summary: add new article 
 *        tags: [article]
 *        requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              title: 
 *                                 type: string
 *                              content: 
 *                                 type: string
 *                              file:
 *                                 type: string
 *                                 format: binary
 *        responses:
 *                 200: 
 *                    description: blog added successfully
 *                    content:
 *                          application/json: 
 *                              schema:
 *                                  $ref: '#/components/schemas/Posts'
 *                 500:
 *                    description: failed to add blog
 *                 401:
 *                    description: unauthorized 
 * 
 *                  
 */


/**
 * @swagger
 * /api/v1/articles/{id}:
 *      patch:
 *          summary: update the article
 *          tags: [article]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                    type: string
 *                required: true
 *                description: article to update
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Posts'
 *          responses: 
 *              200: 
 *                description: article updated successful
 *              404: 
 *                description: article not found
 *              401:
 *                description: unauthorized 
 *
 */

/**
 * @swagger
 * /api/v1/articles/{id}:
 *      delete:
 *          summary: delete an article
 *          tags: [article]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                    type: string
 *                required: true
 *                description: article id to delete
 *          responses: 
 *              200: 
 *                description: the article deleted successfully!
 *              404: 
 *                description: the article not found
 *
 */

/**
 * @swagger
 * /api/v1/articles/{id}/comment:
 *     put: 
 *        summary: add a comment on article 
 *        tags: [comment & like]
 *        parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                    type: string
 *                required: true
 *                description: article to update
 *        requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Comments'
 *        responses:
 *                 200: 
 *                    description: comment added successfully
 *                    content:
 *                          application/json: 
 *                              schema:
 *                                  $ref: '#/components/schemas/Comments'
 *                 500:
 *                    description: failed to add comment
 *                 401:
 *                    description: unauthorized 
 * 
 *                  
 */


/**
 * @swagger
 * /api/v1/articles/{id}/like:
 *     put: 
 *        summary: like an article
 *        tags: [comment & like]
 *        parameters:
 *              - in: path
 *                name: id
 *                schema: 
 *                    type: string
 *                required: true
 *                description: article to update
 *        responses:
 *                 200: 
 *                    description: comment added successfully
 *                    content:
 *                          application/json: 
 *                              schema:
 *                                  $ref: '#/components/schemas/Posts'
 *                 500:
 *                    description: failed to add a like
 *                 401:
 *                    description: unauthorized 
 * 
 *                  
 */


/**
 * @swagger
 * /api/v1/articles/comments/all:
 *    get:
 *       summary: get the list of all comments as Admin
 *       tags: [comment & like]
 *       responses:
 *          200: 
 *              description: get all the list of comments
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                            $ref: '#/components/schemas/Comments'
 *          500: 
 *              description: No comments found
 */



router.route('/')
//Get all the Article
    .get(postsController.getAllPosts)
//Submit a posts
    .post([checkAuth, protect], upload.single('blogImage'), postsController.saveApost);
// like a Article
router.route('/:postId/like')
    .put(checkAuth, postsController.like)

router.route('/:postId')
//specific Article
        .get(postsController.getOnePost)
//Delete Article
        .delete([checkAuth, protect], postsController.deleteOnePost)
//Update Article
        .patch([checkAuth, protect],upload.single('blogImage'), postsController.updatePost);


//comment on Article
router.route('/:postId/comment')
    .put(checkAuth, commentContro.commentOnArticle)
//get specific and delete comments
router.route('/comments/all/:commentId')
    .delete([checkAuth, protect], commentContro.deleteComment)
    .get([checkAuth, protect], commentContro.getOneComment)
router.route('/comments/all')
    .get(commentContro.getAllComments)


module.exports = router;