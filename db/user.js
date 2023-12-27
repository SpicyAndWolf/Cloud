const mongoose = require("mongoose");
const _ = require("lodash");

//数据领域
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  //邮箱地址（唯一性区分用户）

  name: {
    type: String,
    required: true,
  },
  //用户名

  password: {
    type: String,
    required: true,
  },
  //密码

  role_id: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  //角色（0=学生，1=专家）
});

const user = mongoose.model("user", UserSchema); //usermodel

//通过email寻找指定用户
async function findUser(email) {
  return user.find({}).where("email").equals(email);
}

//通过email判定制定用户是否存在
async function isUserExists(email) {
  const resultList = await findUser(email);
  if (resultList.length) {
    return true;
  } else return false;
}

//添加用户
async function addUser(email_i, name_i, password_i) {
  //生成实例，准备存入数据库
  const userInstance = new user({
    email: email_i,
    name: name_i,
    password: password_i,
  });

  //存入数据库
  return userInstance
    .save()
    .then(() => {
      console.log("数据保存成功");
    })
    .catch((err) => {
      console.log("数据保存失败：", err);
    });
}

//更新用户资料（邮件/用户名/密码）
async function updateUser(objectId, email, name, password) {
  return user
    .findByIdAndUpdate(new mongoose.Types.ObjectId(objectId), {
      email: email,
      name: name,
      password: password,
    })
    .then(() => {
      console.log("数据修改成功");
    })
    .catch((err) => {
      console.log("数据修改失败：", err);
    });
}

module.exports = {
  findUser,
  isUserExists,
  addUser,
  updateUser,
};
