// components/Footer.tsx
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 text-center p-4 fixed bottom-0 w-full">
      <div className="z-40 flex justify-between">
        <div>Powered by Bárbara Castilho with Next.js</div>
        <div className="flex gap-4">
          <a href="https://github.com/babicastilho" target="_blank">
            <FaGithub className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/babicastilho/" target="_blank">
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
