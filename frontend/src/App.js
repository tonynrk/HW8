import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar';
import News from './components/News';
import Article from './components/Article';
import Results from './components/Results';
import Bookmarks from './components/Bookmarks';

function App() {

  return (
    <>
      <Router>
      <NavigationBar />
        <Switch>
          <Route exact path="/"  component={props => <News {...props} key={window.location} />} />
          <Route exact path="/article" component={Article} />
          <Route exact path="/search" component={props => <Results {...props} key={window.location} />} />
          <Route exact path="/bookmarks" component={Bookmarks} />
          <Route path="/:section"  component={props => <News {...props} key={window.location} />} />
          
        </Switch>
      </Router>
    </>
  );
}



export default App;
