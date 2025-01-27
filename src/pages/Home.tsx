import { usePageTransition } from '../hooks/usePageTransition';
import React, {ReactElement} from "react";

const Home = (): ReactElement => {
  usePageTransition();
  return (
    <div></div>
  );
};

export default Home;