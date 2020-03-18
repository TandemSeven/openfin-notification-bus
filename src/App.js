import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import './App.css';
import {
  addEventListener,
  create
} from 'openfin-notifications';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

const notification = {
  // Basic info
  title: 'Reminder',
  body: 'Event "Weekly Meeting" is starting soon...',
  category: 'Upcoming Events',

  // We'll use the 'customData' field to store metadata about the event
  customData: {
    eventId: '12345'
  },

  // We want the user clicking the notification to open the associated event,
  // so register an 'onSelect' action
  onSelect: {
    task: 'view-calendar-event',
    target: 'popup'
  },

  buttons: [
    // A button that will schedule another reminder for 5 minutes from now.
    //Since the application will be responsible for snoozing the event,
    //it will need to know about the user clicking this button.
    // By setting a NotificationActionResult for 'onClick', the service
    // will raise a "notification-action" event when this button is clicked,
    // and will pass the value of 'onClick' as the 'result' field within the event
    {
      title: 'Snooze for 5 minutes',
      iconUrl: 'https://www.example.com/timer.png',
      onClick: {
        task: 'schedule-reminder',
        intervalMs: 5 * 60 * 1000
      }
    },

    // A button that closes the notification and doesn't prompt the user
    // about this event again. Since the application doesn't need to do
    // anything when the user clicks this	button, we leave 'onClick'
    // undefined rather than specifying a NotificationActionResult.
    // This means that no action will be raised when the
    // button is clicked, and hence no "notification-action"
    // event will be fired
    {
      title: 'Dismiss',
      iconUrl: 'https://www.example.com/cancel.png'
    }
  ]
};

class App extends Component {
  constructor(props) {
    super(props);

    if (window.fin) {
      addEventListener('notification-action', (event) => {
        const {
          result,
          notification
        } = event;

        console.log(result, notification);
      });
    }
  }

  applySnapShot = async () => {
    const savedSnapshot = JSON.parse(window.localStorage.getItem('snapshot'));

    // save snapshot
    if (!savedSnapshot) {
        const platform = await window.fin.Platform.getCurrent();
        const mySnapshot = await platform.getSnapshot();
        window.localStorage.setItem('snapshot', JSON.stringify(mySnapshot));
        return;
    }

    const platform = await window.fin.Platform.getCurrent();
    const currentSnapshot = await platform.getSnapshot();

    // Check if savedSnapshot is different from the current and only apply snapshot if there is different
    const isSnapShotDifferent = currentSnapshot.windows.some((currentWindow, index) => {
      if (!savedSnapshot.windows[index]) {
        return true;
      }

      return !isEqual(currentWindow.layout.content, savedSnapshot.windows[index].layout.content)
    });

    if (isSnapShotDifferent) {
      platform.applySnapshot(savedSnapshot, {closeExistingWindows: true});
    }
  };

  notify = () => {
    if(window.fin) {
      create(notification);
    }
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/">
            <Home
              applySnapShot={this.applySnapShot}
              notify={this.notify}
            />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
