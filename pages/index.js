// pages/index.js

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(10);
  const [questionType, setQuestionType] = useState('multiple');

  const handleStartGame = () => {
    // Navigate to the game page with query parameters
    router.push(`/game?difficulty=${difficulty}&numQuestions=${numQuestions}&questionType=${questionType}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-dark dark:text-white">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center dark:text-gray-200">Anime/Manga Guessing Game</h1>
        <div className="mb-4">
          <label className="text-lg font-bold mb-2 block">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="text-lg font-bold mb-2 block">Number of Questions:</label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="input input-bordered w-full"
          >
            {[10, 20, 30, 40, 50].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-lg font-bold mb-2 block">Question Type:</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True/False</option>
          </select>
        </div>
        <button
          onClick={handleStartGame}
          className="btn btn-primary w-full mt-4"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Home;
