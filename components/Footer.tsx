// Footer.tsx

import React, { forwardRef } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <footer
      ref={ref} // Attach the ref here
      className="transition-all bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-300 text-center p-4 fixed bottom-0 w-full z-50"
    >
      <div className="flex justify-between">
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
});

Footer.displayName = "Footer";
export default Footer;
