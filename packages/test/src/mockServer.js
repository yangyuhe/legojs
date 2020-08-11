const http = require("http");
let currentUser;
let server = http.createServer((req, res) => {
  if (req.url == "/api/login") {
    handleLogin(req, res);
    return;
  }
  if (req.url == "/api/user") {
    handleUser(req, res);
  }
});
function handleUser(req, res) {
  if (!currentUser) {
    res.statusCode = "401";
    res.end();
  } else {
    res.statusCode = 200;
    res.end(JSON.stringify(currentUser));
  }
}
function handleLogin(req, res) {
  if (req.method == "POST") {
    let msg = "";
    req.on("data", (data) => {
      msg += data;
    });
    req.on("end", () => {
      let user = JSON.parse(msg);
      if (user.username == "1") {
        currentUser = { username: "1", role: "normal" };
      }
      if (user.username == "2") {
        currentUser = { username: "2", role: "admin" };
      }
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          status: "success",
        })
      );
    });
    req.on("error", () => {
      res.statusCode = 500;
      res.end();
    });
  } else {
    res.statusCode = 400;
    res.statusMessage = "method not allowed";
    res.end();
  }
}
server.on("error", (err) => {
  console.log("启动错误:", err);
});
server.listen(3002, () => {
  console.log("启动成功，端口:" + 3002);
});
