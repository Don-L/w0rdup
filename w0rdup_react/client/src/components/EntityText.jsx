const React = require('react');
const EntitySpan = require('./EntitySpan.jsx');
const NonEntitySpan = require('./NonEntitySpan.jsx');


const EntityText = React.createClass({

  render: function(){

    let nodes = [];
    for (let n = 0; n < this.props.spans.length; n++) {
      if (this.props.spans[n].type) {
        nodes.push(<EntitySpan key={n.toString() + this.props.spans[n].content} data={{"type": this.props.spans[n].type, "content": this.props.spans[n].content}} />);
      } else {
        nodes.push(<NonEntitySpan key={n.toString() + this.props.spans[n].content} data={{"content": this.props.spans[n].content}} />);
      }
    };

    return <div style={{textAlign: 'justify', width: 'calc(100% - 60px)', backgroundColor: 'LightSteelBlue ', padding: '30px'}}>{nodes}</div>;

    }

  });


module.exports = EntityText;
