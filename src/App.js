import logo from './logo.svg';
import './App.css';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import Amplify, { Auth, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

Amplify.configure(awsconfig)

//This doesn't really do anything here, but the cognitoIdentityId was used for attaching the policy
Auth.currentCredentials().then(info => {
  const cognitoIdentityId = info._identityId;
  console.log("cognito identity id", cognitoIdentityId);
});

Amplify.addPluggable(new AWSIoTProvider({
     aws_pubsub_region: 'us-west-2',
     aws_pubsub_endpoint: 'wss://a351g8i6j3ec9s-ats.iot.us-west-2.amazonaws.com/mqtt',
   }));

PubSub.subscribe('myTopic').subscribe({
    next: data => console.log('Message received from myTopic', data),
    error: error => console.error(error),
    close: () => console.log('Done'),
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>My App Content </h2>
        <p> This is a paragraph </p>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);

