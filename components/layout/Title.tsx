// components/Title.tsx

import React from "react";
import Image from "next/image";
import logo from "@/public/images/logo.png";

interface TitleProps {
  mainText: string;
  subText: string;
}

const Title: React.FC<TitleProps> = ({ mainText, subText }) => {
  return (
    <div className="w-56 flex flex-row gap-4 items-end xl:justify-center">
      <Image src={logo} alt="Logo" width={50} height={50} /> 
      <div className="text-center">
        <h1 className="font-cookie text-4xl lg:text-5xl text-gray-100 tracking-wider">
          {mainText}
        </h1>
        <span className="text-xs lg:text-sm lowercase font-light tracking-wide text-gray-400 -mt-3 ml-2 block">
          {subText}
        </span>
      </div>
    </div>
  );
};

export default Title;
