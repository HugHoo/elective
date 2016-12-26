let course = {

    list : function(db, fn){
        let courseColl = db.collection("course");

        courseColl.find({}).toArray(function(err, docs){
            assert.equal(err, null);
            
            fn(docs);
        });
    }

}