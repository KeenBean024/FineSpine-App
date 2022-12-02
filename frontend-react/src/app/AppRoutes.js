import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from "../components/Home";
import Error404 from '../components/Error/404';
// import Leaderboard from '../components/Leaderboard';
// import Currentmodel from '../components/Currentmodel';
import Predict from '../components/Predict';
import Upload from '../components/Upload';

const AppRouter = (props) => {

  // console.log("================================== AppRouter ======================================");

  return (
    <React.Fragment>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/predict" exact component={Predict} />
        <Route path="/upload" exact component={Upload} />
        <Route component={Error404} />
      </Switch>
    </React.Fragment>
  );
}

export default AppRouter;