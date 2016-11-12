const React = require('react');


const EntitySpan = React.createClass({

  render: function(){

    let styles = {
      people: {
        backgroundColor: 'red',
        color: 'white'
      },
      places: {
        backgroundColor: 'blue',
        color: 'white'
      },
      art: {
        backgroundColor: 'orange',
        color: 'white'
      },
      events: {
        backgroundColor: 'BlueViolet',
        color: 'white'
      },
      goods: {
        backgroundColor: 'Chartreuse',
        color: 'white'
      },
      organizations: {
        backgroundColor: 'DarkGreen',
        color: 'white'
      },
      other: {
        backgroundColor: 'HotPink',
        color: 'white'
      },
      unknown: {
        backgroundColor: 'LightSkyBlue',
        color: 'white'
      },
    }

    let spanStyle = null;

    switch (this.props.data.type) {
      case 'people':
        spanStyle = styles.people;
        break;
      case 'places':
        spanStyle = styles.places;
        break;
      case 'art':
        spanStyle = styles.art;
        break;
      case 'events':
        spanStyle = styles.events;
        break;
      case 'goods':
        spanStyle = styles.goods;
        break;
      case 'organizations':
        spanStyle = styles.organizations;
        break;
      case 'other':
        spanStyle = styles.other;
        break;
      case 'unknown':
        spanStyle = styles.unknown;
        break;
    }

    return <span style={spanStyle}>{this.props.data.content}</span>;
  }

  });


module.exports = EntitySpan;
