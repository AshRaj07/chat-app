import React from 'react'
import { Redirect, Route } from 'react-router';

const PrivateRoute = ({children,...routeProps}) => {
    const profile = false;

    if(profile===false){
        return <Redirect to="/signin"/>
    }
  return (
    <Route {...routeProps}>{children}</Route>
  )
}

export default PrivateRoute