const React = require('react');


const NonEntitySpan = React.createClass({

  render: function(){


    return <span>{this.props.data.content}</span>;

  }

  });


module.exports = NonEntitySpan;
