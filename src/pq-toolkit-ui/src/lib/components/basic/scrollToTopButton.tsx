'use client';
import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = (): void => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-5 right-5">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-blue-400 dark:bg-blue-500 text-white hover:bg-pink-500 dark:hover:bg-pink-600 transition-all duration-300"
          >
            <FaArrowUp className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTopButton;
