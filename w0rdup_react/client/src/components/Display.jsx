const React = require('react');
const EntityText = require('./EntityText.jsx');


const Display = React.createClass({

  render: function(){

    let key = (<div style={{color: 'white', marginTop: '10px'}}>
                <p style={{margin: '0', backgroundColor: 'red', width: '23%', display: 'inline-block'}}>People</p>
                <p style={{margin: '0', backgroundColor: 'blue', width: '23%', display: 'inline-block'}}>Places</p>
                <p style={{margin: '0', backgroundColor: 'orange', width: '23%', display: 'inline-block'}}>Art</p>
                <p style={{margin: '0', backgroundColor: 'BlueViolet', width: '23%', display: 'inline-block'}}>Events</p>
                <p style={{margin: '0', backgroundColor: 'Chartreuse', width: '23%', display: 'inline-block'}}>Goods</p>
                <p style={{margin: '0', backgroundColor: 'DarkGreen', width: '23%', display: 'inline-block'}}>Organizations</p>
                <p style={{margin: '0', backgroundColor: 'HotPink', width: '23%', display: 'inline-block'}}>Other</p>
                <p style={{margin: '0', backgroundColor: 'LightSkyBlue', width: '23%', display: 'inline-block'}}>Unknown</p>
              </div>);

    if (this.state.text != "") {
      return (
        <div style={{textAlign: 'center'}}>
          <h3>Basic text analysis using Google Cloud Platform's Natural Language <a href="https://cloud.google.com/natural-language" target="_blank">API</a></h3>
          <form onSubmit={this.submitForm}>
            <textarea style={{width: '100%', height: '12em'}} value={this.state.userText} onChange={this.takeUserText}></textarea>
            <input style={{width: '50%', margin: '10px', marginBottom: '30px', backgroundColor: 'LemonChiffon', fontSize: '18px'}}type='submit'></input>
          </form>
          <EntityText spans={this.state.spans}/>
          {key}
          <p><a href="https://cloud.google.com/natural-language/docs/basics#sentiment_analysis" target="_blank">Magnitude</a>: {this.state.magnitude}</p>
          <p><a href="https://cloud.google.com/natural-language/docs/basics#sentiment_analysis" target="_blank">Polarity</a>: {this.state.polarity}</p>
          <h4>Last text analysed:</h4>
          <p style={{textAlign: 'justify', width: 'calc(100% - 60px)', padding: '30px'}}>{this.state.text}</p>
          <footer><p>&copy; Donald Lessells 2016</p></footer>
        </div>
      );
    } else {
      return (
        <div>
          <p>No data received from API - please refresh page if app doesn't appear.</p>
          <footer><p>&copy; Donald Lessells 2016</p></footer>
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
      data: "",
      spans: ''
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
          let response = JSON.parse(request.responseText);
          let entSpans = this.getSpanIndices(response);
          this.setState({
            magnitude: response.sentiment.magnitude,
            polarity: response.sentiment.polarity,
            data: response,
            text: response.submittedText,
            spans: entSpans
          });
      }
    }.bind(this);
  },

  getSpanIndices: function(data) {
    let spans = [];
    for (let key of Object.keys(data.entities)) {
      for (let entity of data.entities[key]) {
        for (let mention of entity.mentions) {
          let content = mention.text.content;
          let beginOffset = mention.text.beginOffset;
          let contentLength = content.length;
          let endOffset = beginOffset + contentLength - 1;
          let mentionSpan = {
                              "type": key,
                              "content": content,
                              "beginOffset": beginOffset,
                              "endOffset": endOffset
                            };
          spans.push(mentionSpan);
        }
      }
    }
    let remainingSpans = this.unTypedSpans(data, spans);
    for (let span of remainingSpans) {
      spans.push(span);
    }
    spans = this.sortSpans(spans);
    spans = spans.map(function(span){return {"type": span.type, "content": span.content}});
    return spans;
  },

  unTypedSpans: function (data, spans) {
    let text = data.submittedText;
    let sorted = this.sortSpans(spans);
    let unTypedArray = [];
    let start = 0;
    for (let i = 0; i < sorted.length; i++) {
      let unTypedString = text.slice(start, sorted[i].beginOffset);
      let span = {
                   "content": unTypedString,
                   "beginOffset": start,
                   "endOffset": sorted[i].beginOffset
                 };
      unTypedArray.push(span);
      start = sorted[i].endOffset + 1;
    }
    let lastString = text.slice(start, text.length);
    let lastSpan = {
                     "content": lastString,
                     "beginOffset": sorted[sorted.length - 1].endOffset + 1,
                     "endOffset": text.length
                   };
    unTypedArray.push(lastSpan);
    return unTypedArray;
  },

  sortSpans: function (spansArray) {
    let sorted = spansArray.sort(function(a, b) {return a.beginOffset - b.beginOffset});
    return sorted;
  }


});

module.exports = Display;
