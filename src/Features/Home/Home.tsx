import React, { FC } from "react";
import Diaries from "../Diary/Diaries";
import Editor from "../Entry/Editor";

const Home: FC = () => {
  return (
    <div className="homePage">
      <Diaries />
      <Editor />
    </div>
  );
};

export default Home;
