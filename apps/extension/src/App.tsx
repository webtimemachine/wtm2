import React from 'react';
import { Router, Route, useLocation } from 'wouter';
import {
  LoginScreen,
  NavigationEntriesScreen,
  SettingsScreen,
  PreferencesScreen,
  ActiveSessionsScreen,
  SignUpScreen,
  ValidateEmailScreen,
  ForgotPasswordScreen,
  ValidateRecoveryCode,
  RecoveryNewPassword,
  AboutWTMScreen,
  ProfileScreen,
} from './screens';
import { ConfirmDeleteAccountScreen } from './screens/confirm-delete-account.screen';
import { useHashLocation } from './hooks';
import { Button, Text } from '@chakra-ui/react';

const App: React.FC = () => {
  return (
    <div className='flex min-h-screen bg-slate-100'>
      <div className='flex w-[550px] min-h-screen'>
        <Router hook={useHashLocation}>
          <Route path='/' component={LoginScreen} />
          <Route
            path='/navigation-entries'
            component={NavigationEntriesScreen}
          />
          <Route path='/settings' component={SettingsScreen} />
          <Route path='/preferences' component={PreferencesScreen} />
          <Route path='/active-sessions' component={ActiveSessionsScreen} />
          <Route path='/sign-up' component={SignUpScreen} />
          <Route path='/validate-email' component={ValidateEmailScreen} />
          <Route
            path='/confirm-delete-account'
            component={ConfirmDeleteAccountScreen}
          />
          <Route path='/forgot-password' component={ForgotPasswordScreen} />
          <Route
            path='/validate-recovery-code'
            component={ValidateRecoveryCode}
          />
          <Route
            path='/recovery-new-password'
            component={RecoveryNewPassword}
          />
          <Route path='/about-wtm' component={AboutWTMScreen} />
          <Route path='/profile' component={ProfileScreen} />
          {/* <Route
            path={'/testqueryparams/*'}
            component={() => {
              const [location, navigate] = useLocation();
              const searchParamsString = location.split('?')[1] || '';
              const params = new URLSearchParams(searchParamsString);

              const name = params.get('name');
              const age = params.get('age');
              console.log(name, age);
              return (
                <div className='p-4'>
                  <Text fontSize='lg' fontWeight='bold'>
                    Test Query Params
                  </Text>
                  <Text>Name: {name || 'No name provided'}</Text>
                  <Text>Age: {age || 'No age provided'}</Text>

                  <div className='mt-4'>
                    <Button
                      colorScheme='blue'
                      onClick={() => {
                        navigate('/');
                      }}
                    >
                      Go Back to Login
                    </Button>
                  </div>
                </div>
              );
            }}
          /> */}
        </Router>
      </div>
    </div>
  );
};

export default App;
