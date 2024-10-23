// components/Title.tsx

import React from 'react';

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return <h1 className="text-2xl lg:text-4xl">{text}</h1>;
};

export default Title;
