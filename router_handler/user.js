const userModel = require("../db/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//注册处理函数
async function register(req, res) {
  const { email, name, password } = req.body;

  //输入为空
  if (!email || !name || !password) {
    return res.send({ status: 1, message: "无效邮箱，用户名或密码" });
  }

  //已被注册的邮箱
  if (await userModel.isUserExists(email)) {
    return res.send({ status: 1, message: "此邮箱已注册账号，请更改" });
  }

  //通过，将密码进行加密，并在数据库内添加用户
  const hash_password = bcrypt.hashSync(password, 10);
  await userModel.addUser(email, name, hash_password);
  return res.send({ status: 0, message: "注册成功" });
}

//登录处理函数
async function login(req, res) {
  const { email, password } = req.body;

  //输入为空
  if (!email || !password) {
    return res.send({ status: 1, message: "无效邮箱，用户名或密码" });
  }

  //不存在以指定邮箱创建的账号
  if (!(await userModel.isUserExists(email))) {
    return res.send({ status: 1, message: "此邮箱未注册" });
  }

  //比较密码
  const _user = await userModel.findUser(email);
  const compareResult = bcrypt.compareSync(password, _user[0].password);
  if (!compareResult) {
    return res.send({ status: 1, message: "密码错误" });
  }
  //比对正确，生成对应账号的JWT
  else {
    const id = _user[0]._id;
    const email = _user[0].email;
    const name = _user[0].name;
    const role = _user[0].role_id;
    const user = { id, email, name, role };
    const config = require("../config");
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: "6h" });
    return res.send({
      status: 0,
      message: "登录成功",
      token: "Bearer " + tokenStr,
    });
  }
}

//更新用户名处理函数
async function updateName(req, res) {
  const id = req.user.id;
  const email = req.user.email;
  const name = req.body.name;
  await userModel.updateUser(id, email, name);
  res.send({ status: 0, message: "修改用户名成功" });
}

//更新密码处理函数
async function updatePassword(req, res) {
  const id = req.user.id;
  const email = req.user.email;
  const name = req.user.name;
  const password = bcrypt.hashSync(req.body.password, 10);
  await userModel.updateUser(id, email, name, password);
  res.send({ status: 0, message: "修改用户名成功" });
}

//暴露接口
module.exports = {
  register,
  login,
  // testJWT,
  updateName,
  updatePassword,
};
