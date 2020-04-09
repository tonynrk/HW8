import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar';
import News from './components/News';
import Article from './components/Article';
import Results from './components/Results';
import Bookmarks from './components/Bookmarks';

function App() {

  const [showSwitch, setShowSwitch] = useState(true);

  
  
  return (
    <>
      
      <Router>
      <NavigationBar showSwitch={showSwitch} />
        <Switch>
          <Route exact path="/"  render={props => <News {...props} setShowSwitch={setShowSwitch(true)} key={window.location} />} />
          <Route exact path="/article" render={props => <Article {...props} setShowSwitch={setShowSwitch(false)} />} />
          <Route exact path="/search" render={props => <Results {...props} setShowSwitch={setShowSwitch(false)} key={window.location} />} />
          <Route exact path="/bookmarks" render={props =>  <Bookmarks {...props} setShowSwitch={setShowSwitch(false)}   />} />
          <Route path="/:section"  render={props => <News {...props} setShowSwitch={setShowSwitch(true)} key={window.location} />} />
        </Switch>
      </Router>
    </>
  );
}



export default App;
