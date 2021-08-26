import logo from './logo.svg';
import './App.css';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

Amplify.configure(awsconfig)
Amplify.addPluggable(new AWSIoTProvider({
     aws_pubsub_region: 'us-west-2',
     aws_pubsub_endpoint: 'wss://a351g8i6j3ec9s-ats.iot.us-west-2.amazonaws.com/mqtt',
   }));

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

PubSub.subscribe('myTopic').subscribe({
    next: data => console.log('Message received', data),
    error: error => console.error(error),
    close: () => console.log('Done'),
});