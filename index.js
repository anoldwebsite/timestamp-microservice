const http = require("http");
const fs = require("fs");

const getTimeStamp = dateObject => ({
  unix: dateObject.getTime(),
  utc: dateObject.toUTCString()
});

const requestHandler = (req, res) => {
  if(req.url === "/"){
    fs.readFile("views/index.html", "utf-8", (err, htmlFileContents) => {
      if(err) throw err;//err is the first argument to our call back function.
      //If no error was thrown then the content of the file index.html are available in 
      //the second argument of our callback funciton.
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(htmlFileContents);
    });
  }else if (req.url.startsWith("/api/timestamp")){
    const dateString = req.url.split("/api/timestamp/")[1];
    let timestamp;
    if(dateString === undefined || dateString.trim() === ""){
      //dateString does not exist; create a new date i.e., current date.
      timestamp = getTimeStamp(new Date());
    } else {
      //A date exist and we need to determine if it is a unix timestamp or 
      //ann ISO-8601 date string. This helps us decide wehther to pass a number or a string to new Date()
      const date = !isNaN(dateString) 
        ? new Date(parseInt(dateString)) //Passing a  number
        : new Date(dateString); //Passing a string
      
        if(!isNaN(date.getTime())){
          timestamp = getTimeStamp(date);
        } else {
          timestamp = {
            error: "invalid date"
          }
        }
    }
    //Nowe we need to send the contents of the timestampl variable to the browser
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(timestamp));
  } else {
    fs.readFile("views/404.html", (err, htmlIn404Page) => {
      if(err) throw err;
      res.writeHead(404, {"Content-Type": "text/html"});
      res.end(htmlIn404Page);
    });
  }
};

const server = http.createServer(requestHandler);
server.listen(process.env.PORT || 4100, err => {
  if(err) throw err;
  console.log(`Server is running on PORT ${server.address().port}`);
});