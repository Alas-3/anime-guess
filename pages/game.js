// pages/game.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ReactHtmlParser from 'react-html-parser';
import { shuffleArray } from '../utils/arrayUtils'; // Import shuffleArray function

const Game = () => {
  const router = useRouter();
  const { difficulty, numQuestions, questionType } = router.query; // Retrieve query parameters from router

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answerStatus, setAnswerStatus] = useState(''); // State to track answer status (correct or incorrect)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=${numQuestions}&category=31&type=${questionType}`
        );
        if (response.data.results.length > 0) {
          const formattedQuestions = response.data.results.map((question) => {
            let options = questionType === 'multiple'
              ? shuffleArray([...question.incorrect_answers, question.correct_answer])
              : ['True', 'False']; // Only shuffle options if in multiple-choice mode

            return {
              ...question,
              options: options,
            };
          });
          setQuestions(formattedQuestions);
          setCorrectAnswer(formattedQuestions[currentQuestionIndex].correct_answer);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (numQuestions && questionType) {
      fetchQuestions();
    }
  }, [numQuestions, questionType]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);

    if (answer === correctAnswer) {
      setScore(score + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }

    setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        setShowResult(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCorrectAnswer(questions[currentQuestionIndex + 1].correct_answer);
      }
      setSelectedAnswer('');
      setAnswerStatus('');
    }, 1000); // Delay for 1 second before moving to next question or showing result
  };

  const handleRestart = () => {
    // Redirect to results page
    router.push({
      pathname: '/result',
      query: { score: score, totalQuestions: questions.length },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-800">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-lg">
        {showResult ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 dark:text-gray-200">Game Over!</h1>
            <p className="text-xl mb-4 dark:text-gray-300">
              You scored {score} out of {questions.length}
            </p>
            <button onClick={handleRestart} className="btn btn-primary w-full">
              Back Home
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg mb-4 dark:text-gray-300">Question #{currentQuestionIndex + 1}</p>
            <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
              {ReactHtmlParser(questions[currentQuestionIndex]?.question)}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={`btn btn-outline relative overflow-hidden ${
                    selectedAnswer === option
                      ? answerStatus === 'correct'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : ''
                  }`}
                  disabled={selectedAnswer !== ''}
                >
                  {ReactHtmlParser(option)}
                  {selectedAnswer === option && (
                    <span
                      className={`absolute inset-0 bg-opacity-0 transition-opacity duration-500 ${
                        answerStatus === 'correct' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                  )}
                  {/* Visual indicator */}
                  {selectedAnswer === option && answerStatus === 'correct' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {selectedAnswer === option && answerStatus === 'incorrect' && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
