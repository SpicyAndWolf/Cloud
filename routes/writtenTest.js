const express = require("express");
const router = express.Router();
const writtenTest_handler = require("../router_handler/writtenTest");

//获取测试种类
router.get("/testType/get", writtenTest_handler.getTestType);
router.get("/Paper/get", writtenTest_handler.getPaper);
router.get("/Paper/getById", writtenTest_handler.getPaperById);
router.get("/Paper/getRandomId", writtenTest_handler.getRandomPaper);
router.post("/Paper/insert", writtenTest_handler.insertPaper);
router.post("/Paper/delete", writtenTest_handler.deletePaper);
router.post("/Answer/insert", writtenTest_handler.insertAnswer);
router.post("/Answer/insertAndCheck", writtenTest_handler.insertAnswerAndCheck);
router.post("/Answer/delete", writtenTest_handler.deleteAnswer);
router.get("/Answer/get", writtenTest_handler.getAnswer);
router.get("/Question/get", writtenTest_handler.getQuestion);
router.get("/Question/getById", writtenTest_handler.getQuestionById);
router.post("/Question/insert", writtenTest_handler.insertQuestion);
router.post("/Question/deleteById", writtenTest_handler.deleteQuestionById);

//暴露路由
module.exports = router;
