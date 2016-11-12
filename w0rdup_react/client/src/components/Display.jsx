const React = require('react');
const Display = React.createClass({

  render: function(){

    if (this.state.text != "") {
      return (
        <div>
          <p>'Lawrence of Arabia' is a highly rated film biography about British Lieutenant T. E. Lawrence. Peter O'Toole plays Lawrence in the film.</p>
          <p>Text: {this.state.text}</p>
          <p>Magnitude: {this.state.magnitude}</p>
          <p>Polarity: {this.state.polarity}</p>
          <form onSubmit={this.submitForm}>
            <textarea value={this.state.userText} onChange={this.takeUserText}></textarea>
            <input type='submit'></input>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <p>'Lawrence of Arabia' is a highly rated film biography about British Lieutenant T. E. Lawrence. Peter O'Toole plays Lawrence in the film.</p>
          <p>Nothing to display :(</p>
            <form>
              <textarea value={this.state.userText} onChange={this.takeUserText}></textarea>
              <input type='submit'></input>
            </form>
        </div>
      );
    }
  },

  getInitialState: function () {
    return {
      text: "",
      magnitude: 0,
      polarity: 0,
      userText: "",
      data: ""
    };
  },

  componentDidMount: function() {
    this.loadResourcesFromServer();
  },

  loadResourcesFromServer: function() {
    let url = this.props.jsonApiUrl;
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function() {
      if(request.status === 200) {
        let data = JSON.parse(request.responseText);
        this.setState({text: data.text,
                       magnitude: data.magnitude,
                       polarity: data.polarity});
      }
    }.bind(this);
    request.send(null);
  },

  takeUserText: function(e) {
    this.setState({userText: e.target.value});
  },

  submitForm: function(e) {
    e.preventDefault();
    let url = this.props.jsonApiUrl;
    let request = new XMLHttpRequest();
    let params = {"userText": `${this.state.userText}`}
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(params));

    request.onreadystatechange = function() {
      if (request.readyState == XMLHttpRequest.DONE) {
        console.log(request.responseText);
          let response = JSON.parse(request.responseText);
          this.setState({
            magnitude: response.sentiment.magnitude,
            polarity: response.sentiment.polarity,
            data: response,
            text: response.submittedText
          });
      }
    }.bind(this);
  }


});

module.exports = Display;
