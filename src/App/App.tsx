import React, { FC, lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../rootReducer";
import "./App.css";

const Auth = lazy(() => import("../Features/Auth/Auth"));
const Home = lazy(() => import("../Features/Home/Home"));

const App: FC = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      <Switch>
        <Route path="/">
          <Suspense fallback={<p>Loading</p>}>
            {isLoggedIn ? <Home /> : <Auth />}
          </Suspense>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
