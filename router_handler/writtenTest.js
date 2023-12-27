const testType = require("../db/testType");
const paper = require("../db/paper");
const answer = require("../db/answer");
const question = require("../db/question");
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

async function getPaperById(req, res) {
  const id = req.query.id;
  const findRes = await paper.findPaperById(id);
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

async function getPaperByQsTag(req, res) {
  //首先看看数据库内部有没有相关试卷
  const queryContent = req.query;
  const findRes = await paper.findPaper(queryContent);
  if (findRes.length != 0) {
    res.json(findRes);
  } else {
    //创建一个试卷，需要有tag、area
    createPaper(req.query);

    //再次查询
    secondQuery = req.query;
    const secondFindRes = await paper.findPaper(secondQuery);
    res.json(secondFindRes);
  }
}

async function createPaper(reqQuery) {
  const { area, tag } = reqQuery;
  const questionArr = await question.findQuestion({ tag: tag });
  let arrLength = questionArr.length;
  let tempArr = []; //存储随机数，防止试题重复
  let questionArrToSend = []; //存储将要向前端推送的题目
  let MaxSize = 10; //试卷最多存储多少题

  //选择将要向前端推送的试题
  if (MaxSize < arrLength / 2) {
    for (let i = 0; i < MaxSize; i++) {
      let randNum = parseInt(Math.random() * arrLength);
      if (tempArr.indexOf(randNum) === -1) {
        tempArr.push(randNum);
        questionArrToSend.push(questionArr[randNum]);
      } else i--;
    }
  } else {
    questionArrToSend = questionArr;
  }

  //生成一个试卷
  await paper.insertPaper(`分类测试： ${tag}`, area, tag, questionArrToSend);
}

async function getRandomPaper(req, res) {
  const paperArr = await paper.findPaper({});
  let arrLength = paperArr.length;
  let randNum = parseInt(Math.random() * arrLength);
  console.log(arrLength);
  console.log(randNum);

  res.json(paperArr[randNum]);
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
  const paperRes = await paper.findPaperById(paperID);
  const questions = paperRes.questions;

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
  res.json({
    score: score,
    answers: answers,
  });
}

async function getQuestion(req, res) {
  const queryContent = req.query;
  const findRes = await question.findQuestion(queryContent);
  res.json(findRes);
}

async function getQuestionById(req, res) {
  const id = req.query.id;
  const findRes = await question.findQuestionById(id);
  console.log(id);
  res.json(findRes);
}

async function insertQuestion(req, res) {
  const { questionType, title, tag, choices, correctAnswer, score } = req.body;
  await question.insertQuestion(
    questionType,
    title,
    tag,
    choices,
    correctAnswer,
    score
  );
  res.send("保存成功");
}

async function deleteQuestionById(req, res) {
  const { id } = req.body;
  await question.deleteQuestionById(id);
  res.send("数据库中已不存在该份答案");
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
  getQuestion,
  getQuestionById,
  insertQuestion,
  deleteQuestionById,
  getPaperById,
  getRandomPaper,
  createPaper,
  getPaperByQsTag,
};
