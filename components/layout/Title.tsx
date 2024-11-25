// components/Title.tsx
import React from "react";
import Image from "next/image";

interface TitleProps {
  mainText: string;
  subText: string;
}

const Title: React.FC<TitleProps> = ({ mainText, subText }) => {
  const logoSrc = process.env.NODE_ENV === "test" ? "" : "/images/logo.png";

  return (
    <div className="flex flex-row gap-5 items-center">
      {logoSrc && (
        <Image
          src={logoSrc}
          alt="Logo"
          width={40}
          height={40}
        />
      )}
      <div>
        <h1 className="font-cookie text-4xl lg:text-5xl text-gray-900 dark:text-gray-100 tracking-wider">
          {mainText}
        </h1>
        <span className="text-xs lg:text-sm lowercase text-gray-600 dark:text-gray-400 -mt-3 ml-2 block">
          {subText}
        </span>
      </div>
    </div>
  );
};

export default Title;
