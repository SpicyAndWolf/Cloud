const testType = require("../db/testType");
const paper = require("../db/paper");
const answer = require("../db/answer");
const mongoose = require("mongoose");

async function getTestType(req, res) {
  const findRes = await testType.findTestType();
  res.json(findRes);
}

async function getPaper(req, res) {
  const queryContent = req.query;
  const findRes = await paper.findPaper(queryContent);
  res.json(findRes);
}

async function insertPaper(req, res) {
  const { title, area, tag, questions } = req.body;
  await paper.insertPaper(title, area, tag, questions);
  res.send("保存成功");
}

async function deletePaper(req, res) {
  const { id } = req.body;
  console.log(id);
  await paper.deletePaper(id);

  //同时删除与paper对应的答案
  await answer.deleteAnswerByPaperID(id);
  res.send("删除成功");
}

async function insertAnswer(req, res) {
  const { paperID, userID, score, answers } = req.body;
  await answer.insertAnswer(paperID, userID, score, answers);
  res.send("保存成功");
}

async function getAnswer(req, res) {
  const queryContent = req.query;
  const findRes = await answer.findAnswer(queryContent);
  res.json(findRes);
}

async function deleteAnswer(req, res) {
  const { answerID } = req.body;
  await answer.deleteAnswer(answerID);
  res.send("数据库中已不存在该份答案");
}

async function insertAnswerAndCheck(req, res) {
  const { paperID, userID, answers } = req.body;
  let score = 0;
  console.log(paperID);
  const paperRes = await paper.findPaperById(paperID);
  const questions = paperRes.questions;
  console.log(questions);

  //开始核对选择题答案
  for (let i = 0; i < questions.length; i++) {
    if (answers[i].answerType === "choice") {
      if (answers[i].content === questions[i].correctAnswer) {
        score += questions[i].score;
        answers[i].rightOrWrong = true;
      } else answer[i].rightOrWrong = false;
    }
  }

  //插入answer
  await answer.insertAnswer(paperID, userID, score, answers);
  res.send({
    score: score,
    answers: answers,
  });
}

module.exports = {
  getTestType,
  getPaper,
  insertPaper,
  deletePaper,
  insertAnswer,
  getAnswer,
  deleteAnswer,
  insertAnswerAndCheck,
};
