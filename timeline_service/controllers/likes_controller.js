const PostModel = require('../models/posts.js');
const LikesModel = require('../models/likes.js')
const CommentsModel = require('../models/comments.js');  
const ShareModel = require('../models/shares.js');

// Create a post 
exports.createPostLikes = async(req, res) => {
    console.log("inside create post likes values here going on --");
    console.log(req.body);
    console.log(req.params);
    console.log("--------------");
    try {
            const likes_data_object = new LikesModel({
                post_id: req.body.post_id,
                liked_by:[req.body.liked_by],
                likes_count: 1,
            });
            
            // Save 
            await likes_data_object.save()

            await PostModel.findByIdAndUpdate(req.params.id, {$set:{
                likes_count: 1,
            }})
             
            res.status(201).send({ likes_data_object })
    } catch (error) {
            res.status(400).send(error)
    }
}; 


// Update post likes 
exports.updatePostLikes = async(req, res) => {
    console.log("inside updaye post likes value heree");
    console.log(req.params);
    console.log(req.body);
    var query = { post_id: req.body.post_id };
    if (req.body.action == 1) {
    var values = { $inc: {likes_count: 1 },
        $push: {liked_by: req.body.liked_by} };    
    } else {    
    var values = { $inc: {likes_count: -1 },
                    $push: {liked_by: req.body.liked_by} };
    }
    LikesModel.updateOne(query, values, function(err, response) {
        if (err) throw res.status(401).send(err);;
        res.status(201).send({ "status": "Successfuly updated likes" })
    });   
}; 


// Update or edit information about user
exports.createCommentsLikes = async(req, res) => {
    try {
            const likes_data_object = new LikesModel({
                post_id: req.params.id,
                comment_id: req.params.comment_id,
                parent_comment_id:req.body.parent_comment_id,
                liked_by:req.body.liked_by,
                likes_count: req.body.liked_by.length,
            });
 
            // Save   
            await likes_data_object.save()
             
            res.status(201).send({ likes_data_object })
    } catch (error) {
            res.status(400).send(error)
    }
};

// Update or edit information about user
exports.updateCommentsLikes = async(req, res) => {
    var query = { post_id: req.params.id, comment_id: req.params.comment_id };
    var values = { $set: {liked_by:req.body.liked_by, likes_count: req.body.liked_by.length } };
    LikesModel.updateOne(query, values, function(err, response) {
        if (err) throw res.status(401).send(err);;
        console.log("1 document updated");
        res.status(201).send({ "status": "Successfuly updated likes" })
    });   
};


//Get Post Object
exports.getPostLikes = async(req, res) => {
    try {
        const likes_data_object = await LikesModel.findById(req.params.id);
        res.status(201).send({ likes_data_object })        
    } catch (error) {
        res.status(400).send(error)
    }
};    


//Get Post Object
exports.getCommentsLikes = async(req, res) => {
    try {
        const post_data_object = await LikesModel.findById(req.params.id);
        res.status(201).send({ post_data_object })        
    } catch (error) {
        res.status(400).send(error)
    }
};    


 