const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();

//app.use(express.static("./public"));
app.use(cors());
app.use(express.json());

const quizzes = [
  {
    id: 0,
    question: "What is the largest cat?",
    a: "Lion",
    b: "Tiger",
    c: "Jaguar",
    answer: "b",
    correct: 0,
    incorrect: 0
  },
  {
    id: 1,
    question: "What is the largest US tower?",
    a: "One World Trade Center",
    b: "Willis Tower",
    c: "Empire State Building",
    answer: "a",
    correct: 0,
    incorrect: 0
  }
];

app.get("/quizzes", (req, res) => {
  const quizList = quizzes.map(quiz => {
    return {
      id: quiz.id,
      question: quiz.question,
      correct: quiz.correct,
      incorrect: quiz.incorrect
    };
  });
  res.json(quizList);
});

app.post("/quizzes", (req, res) => {
  if (
    !req.body.question ||
    !req.body.a ||
    !req.body.b ||
    !req.body.c ||
    !req.body.answer
  ) {
    res.status(400).send();
    return;
  }

  req.body.id = quizzes.length;
  quizzes.push(req.body);
  res.status(201).send();
});

app.get("/quizzes/:quizId", (req, res) => {
  const quizId = Number(req.params.quizId);
  if (isNaN(quizId)) {
    res.status(400).send("Must provide a quiz id");
    return;
  }
  const quiz = quizzes.find(quiz => quiz.id === quizId);
  if (!quiz) {
    res.status(404).send("Quiz does not exist");
    return;
  }
  res.send(
    `
    <h1>${quiz.question}</h1>
    <form method="POST" action="/answers?quizId=${quiz.id}">
      <input type="radio" name="answer" value="a">
      <label for="a" >${quiz.a}</label>
      <input type="radio" name="answer" value="b">
      <label for="b">${quiz.b}</label>
      <input type="radio" name="answer" value="c">
      <label for="c">${quiz.c}</label>
      <button type="submit">Submit Answer</button>
    </form>`
  );
});

app.post("/answers", express.urlencoded(), (req, res) => {
  if (!req.query.quizId || !req.body.answer) {
    res.status(400).send();
  }
  const quiz = quizzes.find(quiz => quiz.id === Number(req.query.quizId));
  if (!quiz) {
    res.status(404).send("Quiz does not exist");
  }
  if (quiz.answer === req.body.answer) {
    res.status(200).send(`<h1>Correct! Nice job</h1>`);
    quiz.correct++;
  } else {
    res.status(200).send(`<h1>Incorrect! Too bad</h1>`);
    quiz.incorrect++;
  }
});

app.listen(port, () => {
  console.log("Quiz server listening on port", port);
});
