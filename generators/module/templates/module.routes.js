const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('<%=name%>', { title: '<%=title%>' });
});

module.exports = router;
