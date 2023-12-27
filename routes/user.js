const express = require("express");
const router = express.Router();
//创建路由对象

const user_handler = require("../router_handler/user");
//导入处理函数

router.post("/api/register", user_handler.register);
router.post("/api/login", user_handler.login);
router.post("/admin/updateName", user_handler.updateName);
router.post("/admin/updatePassword", user_handler.updatePassword);

module.exports = router;
//共享路由对象
