import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// pages
import Menu from './pages/Menu'
import JoinGame from './pages/JoinGame'
import FindGame from './pages/FindGame'
import NotFound from './pages/NotFound'

function App() {

  return (
    <Router>

      <Switch>

        <Route exact path={"/"}>
          <Menu />
        </Route>

        <Route exact path={"/game"}>
          <JoinGame />
        </Route>

        <Route exact path={"/find"}>
          <FindGame />
        </Route>

        <Route path={"*"}>
          <NotFound />
        </Route>
        
      </Switch>

    </Router>
  );
}

export default App;
