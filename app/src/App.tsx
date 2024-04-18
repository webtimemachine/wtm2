import React from 'react';
import {HelloWorldScreen} from './screens/hello-world.screen';
import {HelloWorld2Screen} from './screens/hello-world-2.screen';
import {useCurrentScreen} from './hooks';

const App: React.FC<{}> = () => {
  const {currentScreen} = useCurrentScreen();

  return (
    <>
      {currentScreen === 'HelloWorld' && <HelloWorldScreen />}
      {currentScreen === 'HelloWorld2' && <HelloWorld2Screen />}
    </>
  );
};

export default App;
