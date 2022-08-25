const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require('fs')
require('dotenv').config()

// Creating app
const app = express();

// Passing fileUpload as a middleware
app.use(fileUpload());

// For handling the upload request
app.post("/upload", function (req, res) {
    const password = JSON.parse(JSON.stringify(req.body)).password
    if(password != process.env.CLIENT_PASSWORD) {
        res.send('INCORRECT PASSWORD')
        console.log("Upload request FAILED")
    } else {
        if (req.files && Object.keys(req.files).length !== 0) {
            
            const uploadedFile = req.files.uploadFile;
    
            const uploadPath = __dirname
                + "/uploads/" + uploadedFile.name;
    
            uploadedFile.mv(uploadPath, function (err) {
            if (err) {
                console.log(err);
                res.send("Failed !!");
                console.log("Upload request Failed")
            } else res.send("Successfully Uploaded !!"); console.log("Upload Successful")
            });
        } else res.send("No file uploaded !!"); console.log("Upload Failed")
    }
});

app.post("/download", function (req, res) {
    const fileName = JSON.parse(JSON.stringify(req.body)).fileName
    const password = JSON.parse(JSON.stringify(req.body)).password
    if(fileName && password == process.env.CLIENT_PASSWORD){
        try {
            res.download(__dirname + `/uploads/${fileName}`, function (err) {
                console.log("Download Successful")
                if (err) {
                console.log(err);
                console.log("Download Request")
                }
            });
        } catch(err){
            res.send("ERROR")
            console.log("Download Failed")
        }
    }
});

app.post('/delete', function (req, res) {
    const fileName = JSON.parse(JSON.stringify(req.body)).fileName
    const password = JSON.parse(JSON.stringify(req.body)).password

    if(fileName && password == process.env.CLIENT_PASSWORD){
        try {
            fs.unlink(`./uploads/${fileName}`, function (err) {
                if (err) console.log(err)
                console.log('file deleted')
                res.send('File deleted')
            })
        } catch(err){
            res.send("ERROR")
            console.log("Delete Failed")
        }
    }
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/archive", function (req, res)  {
    // const files = fs.readdirSync('./uploads').filter(files => files.endsWith('.zip'))
    const files = fs.readdirSync('./uploads')
    console.log("Archive Request")
    res.send(files)
})

app.listen(3000, function (req, res) {
    console.log("Started listening to port 3000");
});
