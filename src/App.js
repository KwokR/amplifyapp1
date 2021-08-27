import './App.css';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import Amplify, { Auth, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import Header from './components/Header';
import Tasks from './components/Tasks';
import { useState } from "react";
import AddTask from './components/AddTask'

Amplify.configure(awsconfig)

//get the cognito id with auth module
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
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks]= useState([
    {
        id: 1,
        text: 'Doc appt',
        day: 'Feb 1, 2021',
        reminder: true,
    },
    {
        id: 2,
        text: 'puppy shower',
        day: 'March 1, 2021',
        reminder: false
    },
    {
        id: 3,
        text: 'Groceries',
        day: 'April 1, 2021',
        reminder: true,
    },

]);
//Add task
const addTask = (task) => {
  const id = Math.floor(Math.random()*10000) + 1
  const newTask = {id, ...task}
  setTasks([...tasks,newTask]) //copies the existing list ...tasks and addes the new record (newTask)
}
//Delete tasks
const deleteTask = (id) =>{
  //console.log('delete', id)
  setTasks(tasks.filter((task)=>task.id !== id))
}
//toggle reminder
const toggleReminder = (id) => {
  setTasks(tasks.map((task) => 
    task.id === id ? {...task, reminder:
      !task.reminder}: task))
}

  return (
    <div className="container">
      <Header  onAdd={() => setShowAddTask(
        !showAddTask)} showAdd={showAddTask}/>

      {showAddTask && <AddTask onAdd={addTask}/>}

      { tasks.length > 0 ? 
        <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 
        'No Tasks To Show' }
      <AmplifySignOut /> 
    </div>
  );
}
  
export default withAuthenticator(App);
// export default (App);

