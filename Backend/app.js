const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config(); // Import dotenv

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable
});

app.get("/quiz", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content:
            "Generate a 5 question multiple choice quiz about the history of mail. Provide 4 options for each question and indicate the correct answer. Put each item on a new line for easy parsing. The question should go first, then multiple choices and then the correct answer.  No blank lines and start from 1 to 5.",
        },
      ],
    });
    console.log(response.choices[0].message.content);
    const quiz = response.choices[0].message.content
      .trim()
      .split("\n")
      .filter((line) => line.trim().length > 0);
    const questions = [];
    console.log(quiz, "quiz");
    for (let i = 0; i < quiz.length; i += 6) {
      questions.push({
        question: quiz[i],
        options: [quiz[i + 1], quiz[i + 2], quiz[i + 3], quiz[i + 4]],
        correct: quiz[i + 5], // Adjust this according to how the correct answer is indicated
      });
    }

    res.json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
