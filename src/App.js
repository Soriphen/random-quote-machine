import React from 'react';
import './sass/App.scss';
import QuoteBox from './sass/components/quote_box/quoteBox';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <QuoteBox />
      </div>
    );
  }
}

export default App;
