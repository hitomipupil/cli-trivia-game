import { Command } from "commander";
import readline from "node:readline";

const program = new Command();

const trivias = [
  {
    trivia: "Which year did the first man land on the Moon?",
    options: ["1965", "1969", "1972", "1980"],
    rightAnswer: "1969",
  },
  {
    trivia: "What is the busiest port in Europe?",
    options: [
      "Port of Antwerp",
      "Port of Hamburg",
      "Port of Amsterdam",
      "Port of Rotterdam",
    ],
    rightAnswer: "Port of Rotterdam",
  },
  {
    trivia: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Mercury"],
    rightAnswer: "Mars",
  },
  {
    trivia: "What is the capital of Japan?",
    options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"],
    rightAnswer: "Tokyo",
  },
  {
    trivia: "Which language is primarily used to style web pages?",
    options: ["HTML", "JavaScript", "CSS", "Python"],
    rightAnswer: "CSS",
  },
  {
    trivia: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    rightAnswer: "7",
  },
  {
    trivia: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
    rightAnswer: "Leonardo da Vinci",
  },
  {
    trivia: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    rightAnswer: "Pacific Ocean",
  },
  {
    trivia: "Which animal is known as the King of the Jungle?",
    options: ["Tiger", "Elephant", "Lion", "Gorilla"],
    rightAnswer: "Lion",
  },
  {
    trivia: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing Unit",
    ],
    rightAnswer: "Central Processing Unit",
  },
];

const preparedTrivias = trivias.map((trivia) => {
  const correctIndex = trivia.options.indexOf(trivia.rightAnswer);
  const correctChoice = correctIndex + 1;
  return {
    ...trivia,
    correctChoice: correctChoice,
  };
});

const ask = (questionText, rl) => {
  return new Promise((resolve) => {
    rl.question(questionText, (answer) => {
      resolve(answer);
    });
  });
};

const questionText = (trivia) => {
  const optionsText = trivia.options
    .map((opt, index) => {
      return `${index + 1}: ${opt}`;
    })
    .join("\n");
  return `${trivia.trivia}\n\n${optionsText}\n\nYour answer: `;
};

const parseUserChoice = (choice) => {
  const trimmedChoice = choice.trim();
  if (trimmedChoice === "") return null;
  const choiceNum = Number(trimmedChoice);
  if (Number.isNaN(choiceNum) || !Number.isInteger(choiceNum)) return null;
  if (choiceNum > 0 && choiceNum < 5) {
    return choiceNum;
  } else {
    return null;
  }
};

const proceedText = "Press Enter to proceed to the next question :)\n";

const comment = (score) => {
  if (score < 3) return "Oups, study harder!";
  if (score < 8) return "Good score!";
  return "Master of trivia!";
};

const triviaAction = async () => {
  console.log("Welcome!");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let score = 0;
  for (let i = 0; i < preparedTrivias.length; i++) {
    const rowUserChoice = await ask(questionText(preparedTrivias[i]), rl);
    let choice = parseUserChoice(rowUserChoice);
    while (choice === null) {
      console.log("Please type 1-4");
      const next = await ask("Your answer (1-4): ", rl);
      choice = parseUserChoice(next);
    }
    const result =
      choice === preparedTrivias[i].correctChoice ? "Correct!" : "Incorrect!";
    if (result === "Correct!") {
      score++;
    }
    console.log(`\n${result} Current Score: ${score}`);
    if (i < preparedTrivias.length - 1) await ask(proceedText, rl);
  }
  console.log(`Final score: ${score}`);
  console.log(comment(score));
  rl.close();
};

program
  .name("trivia")
  .description("CLI to try your knowledge")
  .version("0.0.1")
  .action(async () => {
    await triviaAction();
  });

program.parse();
