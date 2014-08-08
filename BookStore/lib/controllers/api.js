'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    async = require('async'),
    Books = mongoose.model('Books'),
    Publishers = mongoose.model('publisher');

exports.getBooks = function(req,res){
    return Books.find({type:"book"}).sort({bookName:1}).exec(function(err,books){
        if (!err){

            return res.json(books);
        } else{
            console.log(err);
            return res.send(err);
        }
    });
}

exports.getFilteredBooks = function (req, res) {
    console.log(req.body);

    var filterObj = {};
    filterObj.type = "book";
    filterObj["Publisher._id"] = new RegExp(".*" + req.body["Publisher._id"] + ".*");
    filterObj.bookName = new RegExp("^"+req.body["bookName"] + ".*$");
    filterObj.Writer = new RegExp(".*" + req.body["Writer"] + ".*");

    if (req.body["sNo"].trim() != '' && req.body["sNo"] != undefined) {
        filterObj.sNo = new RegExp(".*" + req.body["sNo"] + ".*");
    }

    

    console.log(filterObj);

    Books.find(filterObj).limit(req.body.take).skip(req.body.skip).sort({ sNo: 1 }).exec(function (err, books) {
        if (!err) {
            
            var result = {};
            result.data = books;
            Books.count(filterObj, function (err, count) {
                result.count = count;
                return res.json(result);
            });
        } else {
            console.log(err);
            return res.send(err);
        }
    });
}

exports.getBooksAndSets = function(req,res){

    console.log('req received -- Books & Sets')

    return Books.find({}).populate('set_books').exec(function(err,books){
        if (!err){
            return res.json(books);
        } else{
            console.log(err);
            return res.send(err);
        }
    });
}

exports.deleteBook = function(req,res){
    Books.remove({_id:req.params.bookId},function(err){
        if (!err){
            return res.json({result:'success'});
        }
        else{
            res.send(err);
        }
    })
}

exports.addBook = function(req,res){

    console.log(req.body);
    req.body.type = "book";
    var book = new Books(req.body);
    return book.save(function(err,book){
        if (err){
            console.log(err);
            return res.send(err);
        }
       else{
            return res.json(book);
        }
    });

}

exports.updateBook = function(req,res){
    console.log(req.body);
    Books.update({_id:req.params.bookId},{$set:req.body},function(err,book){

        if(err)
        {   console.log(err);
            return res.send(err);
        }else{
            return res.json(book);
        }
    })
}

exports.getOneBook= function(req,res){

    Books.find({_id:req.params.bookId},function(err,book){

        if (err){
            return res.send(err);
        }
        else{
            return res.json(book[0]);
        }
    });
}

exports.addPublisher = function(req,res)
{

    var publisher = new Publishers(req.body);
    return publisher.save(function(err,publisher){
        if (err){
            return res.send(err);

        }
        else{
            res.json(publisher);
        }

});
}

exports.getPublishers = function(req,res)
{
    return Publishers.find(function(err,publishers){
        if (!err){
            console.log(publishers);
            return res.json(publishers);
        } else{
            console.log(err);
            return res.send(err);
        }
    });
}

exports.updatePublisher = function(req,res){

    console.log('updating publisher');
    console.log(req.body);
    console.log(req.params);
     Publishers.update({_id:req.params.publisherId},{$set:req.body},function(err,publisher){
            if (!err)
            {
                console.log('publisher updatated');
                console.log(publisher);
                console.log('updating books');

                Books.update({'Publisher._id':req.params.publisherId},{$set:{'Publisher':req.body}},function(err,book){
                    if (!err){

                        console.log('books updated');
                        console.log(book);

                        return res.json(publisher);

                    }else{
                        console.log('error occured');
                        console.log(err);
                        return res.send(err);
                    }
                });
            }
         else{
                console.log('error occured');
                console.log(err);
            }
     });
}

exports.deletePublisherAPI = function(req,res){

    var PublisherId = req.params.publisherId;

    console.log('Publisher to Remove: '+PublisherId);

    Books.count({'Publisher._id':PublisherId},function(err,count){
        if (!err){

            console.log('Count:' + count);

            if (count>0){
                return res.json({result:'use'});
            }
            else{
                console.log('Removing Publisher');

                Publishers.remove({_id:PublisherId},function(err,response){
                    if (!err){
                        console.log(response);
                        return res.json(response);
                    }
                    else{
                        console.log(err);
                        return res.json(error);
                    }
                })
            }
        }

        else{
            console.log('error:'+err);
        }
    })

}

exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
}


