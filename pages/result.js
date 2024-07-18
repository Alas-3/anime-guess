// pages/result.js

import Link from 'next/link';
import { useRouter } from 'next/router';

const Result = () => {
  const router = useRouter();
  const { correctCount } = router.query;

  if (typeof window !== 'undefined' && isNaN(correctCount)) {
    router.replace('/');
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <p className="text-lg mb-4">
        You got {correctCount} {correctCount === '1' ? 'question' : 'questions'} correct!
      </p>
      <Link href="/">
        <a className="text-blue-500 hover:underline">
          Back to Home
        </a>
      </Link>
    </div>
  );
};

export default Result;
