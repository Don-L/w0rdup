var React = require('react');
var ReactDOM = require('react-dom');
var Display= require('./components/Display.jsx');

window.onload = function(){
  ReactDOM.render(
    <Display jsonApiUrl="http://localhost:9000"
    />,
    document.getElementById('app')
  );
}
