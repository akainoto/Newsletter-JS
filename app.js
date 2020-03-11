const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {

  const firstName = req.body.fName
  const lastName = req.body.lName
  const email = req.body.email

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merged_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  var jsonData = JSON.stringify(data);

  // us19 - the 19 comes from the end of the API key
  const url = "https://us19.api.mailchimp.com/3.0/lists/63d2b5bd40";

  const options = {
    method: "POST",
    auth: "chrisTEST:650fd3f97f7bc6ffacdef3a8ccf4f37f-us19"
  }

  const request = https.request(url, options, function(response) {

    // 200 is the code for success, unlike a 404 error code.
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
});

// Try again button sends user back to homepage or home route.
app.post("/failure", function(req, res) {

  res.redirect("/")
})

//listen on dynamic port OR our local 3000 port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is operating on port 3000");
});
