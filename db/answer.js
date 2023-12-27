const mongoose = require("mongoose");
const collectionName = "Answers";

// 创建 schema
const answerSchema = new mongoose.Schema({
  answerType: String,
  content: String,
  rightOrWrong: {
    type: Boolean,
    default: null,
  },
});

const schema = new mongoose.Schema({
  paperID: String,
  userID: String,
  score: {
    type: Number,
    default: 0,
  },
  answers: [answerSchema],
});

// 创建 model
const model = mongoose.model(collectionName, schema);

// 查找函数
async function findAnswer(content) {
  return model.find({}).where(content);
}

async function insertAnswer(paperID_i, userID_i, score_i, answers_i) {
  //生成实例，准备存入数据库
  const answerInstance = new model({
    paperID: paperID_i,
    userID: userID_i,
    score: score_i,
    answers: answers_i,
  });

  //存入数据库
  return answerInstance
    .save()
    .then(() => {
      console.log("数据保存成功");
    })
    .catch((err) => {
      console.log("数据保存失败：", err);
    });
}

async function deleteAnswer(id) {
  return model
    .findByIdAndDelete(new mongoose.Types.ObjectId(id))
    .then(() => {
      console.log("答案删除成功");
    })
    .catch((err) => {
      console.log("答案删除失败：", err);
    });
}

async function deleteAnswerByPaperID(id) {
  return model
    .deleteMany({ paperID: id })
    .then(() => {
      console.log("答案删除成功");
    })
    .catch((err) => {
      console.log("答案删除失败：", err);
    });
}

// 暴露函数
module.exports = {
  findAnswer,
  insertAnswer,
  deleteAnswer,
  deleteAnswerByPaperID,
};
