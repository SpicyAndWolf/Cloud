const mongoose = require("mongoose");
const collectionName = "questions";

// 创建 schema
const schema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: ["choice", "text"],
    default: null,
  },
  title: String,
  tag: String,
  choices: [String],
  correctAnswer: String,
  score: {
    type: Number,
    default: 0,
  },
});

// 创建 model
const model = mongoose.model(collectionName, schema);

// 查找函数
async function findQuestion(content) {
  return model.find({}).where(content);
}

async function findQuestionById(id) {
  return model.findById(new mongoose.Types.ObjectId(id));
}

async function insertQuestion(
  questionType_i,
  title_i,
  tag_i,
  choices_i,
  correctAnswer_i,
  score_i
) {
  //生成实例，准备存入数据库
  const questionInstance = new model({
    questionType: questionType_i,
    title: title_i,
    tag: tag_i,
    choices: choices_i,
    correctAnswer: correctAnswer_i,
    score: score_i,
  });

  //存入数据库
  return questionInstance
    .save()
    .then(() => {
      console.log("题目插入成功");
    })
    .catch((err) => {
      console.log("题目插入失败：", err);
    });
}

async function deleteQuestionById(id) {
  return model
    .findByIdAndDelete(new mongoose.Types.ObjectId(id))
    .then(() => {
      console.log("问题删除成功");
    })
    .catch((err) => {
      console.log("问题删除失败：", err);
    });
}

// 暴露函数
module.exports = {
  findQuestion,
  findQuestionById,
  insertQuestion,
  deleteQuestionById,
  schema,
};
