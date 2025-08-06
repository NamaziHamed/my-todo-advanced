import React, { ReactNode } from "react";
import Providers from "../Providers";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <header className="py-10 bg-slate-900">
        <h2
          className="
    text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r
    from-blue-500 via-sky-400 to-blue-500 text-transparent bg-clip-text
    w-fit mx-auto"
        >
          Welcome to Hamed's Todo App
        </h2>
      </header>
      {children}
    </Providers>
  );
};

export default layout;
