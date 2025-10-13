import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        className="bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors w-20 h-20 flex items-center justify-center text-4xl cursor-pointer"
        id="toggleGuideFloatingButton"
        role="button"
        aria-label="Guia Interativo"
        onClick={handleClick}
        type="button">
        ♿
      </button>
    </div>
  );
};

export default FloatingButton;
