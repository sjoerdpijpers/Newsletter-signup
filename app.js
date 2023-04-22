var bodyParser = require('body-parser');
const express = require('express');
const https = require('node:https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})
  
app.post("/", (req,res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // console.log(firstName,lastName,email);
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/c626ad5752";
    
    const options = {
        method: "POST",
        auth: "sjoerd108:1bfd3ed00c51836599c5187b58a32acf-us21"
    }
    
    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, () => {
console.log("Server is running on port 3000.");
})


// API Key
// 1bfd3ed00c51836599c5187b58a32acf-us21

// List/Audience ID
// c626ad5752 