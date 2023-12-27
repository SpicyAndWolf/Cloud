const mongoose = require("mongoose");
const collectionName = "papers";

// 创建 schema
const questionSchema = new mongoose.Schema({
  type: String,
  title: String,
  choices: [String],
  correctAnswer: String,
  score: Number,
});

const schema = new mongoose.Schema({
  title: String,
  area: String,
  tag: String,
  questions: [questionSchema],
});

// 创建 model
const model = mongoose.model(collectionName, schema);

// 查找函数
async function findPaper(content) {
  return model.find({}).where(content);
}

async function findPaperById(id) {
  return model.findById(new mongoose.Types.ObjectId(id));
}

async function insertPaper(title_i, area_i, tag_i, questions_i) {
  //生成实例，准备存入数据库
  const paperInstance = new model({
    title: title_i,
    area: area_i,
    tag: tag_i,
    questions: questions_i,
  });

  //存入数据库
  return paperInstance
    .save()
    .then(() => {
      console.log("数据保存成功");
    })
    .catch((err) => {
      console.log("数据保存失败：", err);
    });
}

async function deletePaper(id) {
  return model
    .findByIdAndDelete(new mongoose.Types.ObjectId(id))
    .then(() => {
      console.log("试卷删除成功");
    })
    .catch((err) => {
      console.log("试卷删除失败：", err);
    });
}

// 暴露函数
module.exports = {
  findPaper,
  insertPaper,
  deletePaper,
  findPaperById,
};
