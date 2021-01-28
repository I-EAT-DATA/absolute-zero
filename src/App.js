import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// pages
import Menu from './pages/Menu'
import JoinRoom from './pages/JoinRoom'
import BuzzerControl from './pages/BuzzerControl'
import BuzzerRoom from './pages/BuzzerRoom'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>

      <Switch>

        <Route exact path={"/"}>
          <Menu />
        </Route>

        <Route exact path={"/join"}>
          <JoinRoom />
        </Route>

        <Route exact path={"/control"}>
          <BuzzerControl />
        </Route>

        <Route exact path={"/room"}>
          <BuzzerRoom />
        </Route>

        <Route path={"*"}>
          <NotFound />
        </Route>
        
      </Switch>

    </Router>
  );
}

export default App;
