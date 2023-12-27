const mongoose = require("mongoose");
const collectionName = "test_types";

// 创建 schema
const schema = new mongoose.Schema({
  area: String,
  way: [
    {
      paperType: String,
      nameList: [String],
    },
  ],
});

// 创建 model
const model = mongoose.model(collectionName, schema);

// 查找函数
async function findTestType() {
  return model.find({});
}

// 暴露函数
module.exports = {
  findTestType,
};
