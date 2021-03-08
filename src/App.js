import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { DndProvider } from 'react-dnd'
import { HTML5Backend }  from 'react-dnd-html5-backend' 

// pages
import Menu from './pages/Menu'
import JoinGame from './pages/JoinGame'
import FindGame from './pages/FindGame'
import HostSettings from './pages/HostSettings'
import NotFound from './pages/NotFound'

function App() {

  return (
    <Router>

      <Switch>

        <Route exact path={"/"}>
          <Menu />
        </Route>

        <Route exact path={"/game"}>
          <DndProvider backend={HTML5Backend}>
            <JoinGame />
          </DndProvider>
        </Route>

        <Route exact path={"/find"}>
          <FindGame />
        </Route>

        <Route exact path={"/settings"}>
          <HostSettings />
        </Route>

        <Route path={"*"}>
          <NotFound />
        </Route>
        
      </Switch>

    </Router>
  );
}

export default App;
