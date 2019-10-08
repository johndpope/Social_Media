const PostModel = require('../models/posts.js');
const LikesModel = require('../models/likes.js')
const CommentsModel = require('../models/comments.js');
const ShareModel = require('../models/shares.js');

// Create a post 
exports.create = async(req, res) => {
    console.log('insiididideineininineeiweijwiejwijewjewjeiw');
    console.log(req.params);
    try {
            console.log('iside try blocccckkk');
            const comments_data_object = new CommentsModel({
                used_id: req.body.comment.user_id,
                post_id: req.params.post_id,
                media:req.body.comment.media,
                tags:req.body.comment.tags,
                parent_comment_id: req.params.parent_comment_id,
                comment_text: req.body.comment.comment_text
            });
            
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbefore save');
             // Save 
            await comments_data_object.save()
            console.log('cccccccccccccccccccccccccccc after save');
            
            console.log('parent comment check value eisssssss == ');
            console.log(req.params.parent_comment_id);
            console.log("/////////");
            console.log(comments_data_object);

            if (req.params.parent_comment_id != "0") {
                console.log('coming inside hereeeeeee');
                await CommentsModel.updateOne(
                    // find record with name "MyServer"
                    { post_id: req.params.post_id, _id: req.params.parent_comment_id },
                    // increment it's property called "ran" by 1
                    { $inc: { replies_count: 1 } }
                );
                res.status(201).send({ comments_data_object })                
            } else {
                res.status(201).send({ comments_data_object })
            }

    } catch (error) {
            res.status(400).send(error)
    }
}; 


// Update or edit information about user
exports.update = (req, res) => {
    console.log('insiide update valuuuuueeeeeeeeeeee');
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    CommentsModel.findByIdAndUpdate(req.params.id, {$set:{
        media:req.body.comment.media,
        tags:req.body.comment.tags,
        comment_text: req.body.comment.comment_text,
    }})
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Record not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating record with id " + req.params.id
        });
    });
};


//Get Post Object
exports.get = async(req, res) => {
    console.log('inside geeetttttttttt valueeeeeeee');
    console.log(req.query);
    console.log(req.params);
    try {
        const comments_data_object = await CommentsModel.findById(req.params.id);
        res.status(201).send({ comments_data_object })        
    } catch (error) {
        res.status(400).send(error)
    }
};    


//Delete Post Object
exports.delete = async(req, res) => {
    const filter = {$or:[{_id: req.params.id},{parent_comment_id:req.params.id}]};
    var parent_comnt_id = null
    var err_status = false;
    try {
        //await CommentsModel.findByIdAndDelete(req.params.id);
        await CommentsModel.find(filter, function (err, data) {
            if (err) {
                err_status = true
                res.status(401).send(err);
            } else if (data.length == 0) {
                err_status = true
                res.status(201).send({"status": "No record found"});
            } else {
                parent_comnt_id = data[0].parent_comment_id;
                 CommentsModel.deleteMany(filter, function (err, r) {
                    if (err) {
                        err_status = true
                        res.status(401).send(err);
                    }
                }); 
            }
        }); 
        if (parent_comnt_id != "0" && parent_comnt_id != null && err_status == false) {
            await CommentsModel.updateOne(
                // find record with name "MyServer"
                { _id: parent_comnt_id },
                // increment it's property called "ran" by 1
                { $inc: { "replies_count": -1 } }
            );
        }
        res.status(201).send({ "status": "Successfuly deleted comments" })        
    } catch (error) {
        res.status(400).send(error)
    }
};  

//Delete Post Object
/*exports.delete = async(req, res) => {
    console.log('inside geeetttttttttt valueeeeeeee');
    console.log(req.query);
    console.log(req.params);
    try {
        const post_data_object = await PostModel.findByIdAndDelete(req.params.id);
        res.status(201).send({ "status": "Successfuly deleted post" })        
    } catch (error) {
        res.status(400).send(error)
    }
};  */