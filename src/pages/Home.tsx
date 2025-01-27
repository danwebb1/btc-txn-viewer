import { usePageTransition } from '../hooks/usePageTransition.ts';
import React, {ReactElement} from "react";

const Home = (): ReactElement => {
  usePageTransition();
  return (
    <div></div>
  );
};

export default Home;