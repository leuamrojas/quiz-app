import React, { useState } from 'react';
import { Difficulty, QuestionState, fetchQuizQuestions } from './API';
// Components
import QuestionCard from './components/QuestionCard';
// Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean; // tells if the user answered correctly
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

function App() {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  // const [questionAnswered, setQuestionAnswered] = useState(false);

  console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    )

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
    // setQuestionAnswered(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Users answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct)
        setScore(prev => prev + 1);
      // Save answer in the array for user's answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers(prev => [...prev, answerObject]);
      // setQuestionAnswered(true);
    }
  }

  const nextQuestion = () => {
    // Move on to the next question if not the last
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
    // setQuestionAnswered(false);
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper> {/* <div className="App"> */}
        <h1>REACT QUIZ</h1>
        {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && (
          <button className='start' onClick={startTrivia}>
            Start
          </button>)}
        {!gameOver && <p className='score'>Score: {score}</p>}
        {loading && <p>Loading Questions ...</p>}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
            // questionAnswered={questionAnswered}
          />
        )}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 &&
          (<button className='next' onClick={nextQuestion}>
            Next Question
          </button>
          )}
      </Wrapper>
    </>
  );
}

export default App;
