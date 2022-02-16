import React from 'react';

export default function Intercepet(props) {
  if (props.history.location.pathname !== '/Login') {
    !localStorage.getItem('token') && props.history.push('/Login');
    if (props.history.location.pathname === '/') {
      localStorage.getItem('token') && props.history.push('/Home/welecome');
    }
  }
  return <div></div>;
}
