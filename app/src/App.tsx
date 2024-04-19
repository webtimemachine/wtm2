import React from 'react'
import { LoginScreen } from './screens/login.screen'
import { useCurrentScreen } from './hooks'

const App: React.FC<{}> = () => {
  const { currentScreen } = useCurrentScreen()

  return (
    <>
      {currentScreen === 'Login' && <LoginScreen />}
    </>
  )
}

export default App
