const Router = require("express").Router;
const ws = require("../libs").ws;
const sockets = ws.sockets;
const router = Router();

router.post("/create", (req, res) => {
  const user = req.body;
  if (sockets.get(user.name)) {
    res.status(409);
    res.json("duplicate user name");
    return;
  }
  res.status(201);
  res.json({ name: user.name });
  return;
});

module.exports = router;
