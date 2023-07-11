const {model, Schema} = require('mongoose'); //importing from mongoose
 
let mcSchema = new Schema({ //creating a new schema
    ip: String, //option ip as string
    UserID: String, //option userid as string
    Guild: String //option guild as string
});
 
module.exports = model("mcSchema", mcSchema); //exporting the schema so we can use it in any file we want