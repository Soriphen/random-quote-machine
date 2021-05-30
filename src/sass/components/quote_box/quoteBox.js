import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './quoteBox.scss';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

// Importing Fontawesome icons.
const quoteLeft = <FontAwesomeIcon icon={faQuoteLeft} />;
const twitter = <FontAwesomeIcon icon={faTwitter} />;

// Importing the Random Color script from https://www.npmjs.com/package/randomcolor
var randomColour = require('randomcolor');

const fadeDuration = 500;

// Using style-components in order to streamline some ReactJS functionality into CSS styles, specifically for working transitions into state changes.
const FadeDiv = styled.div`
  #App-header {
    background-color: ${props => props.fadeColor};
    color: ${props => props.fadeColor};
  }

  #new-quote {
    background-color: ${props => props.fadeColor};
  }

  #tweet-quote {
    background-color: ${props => props.fadeColor};
  }

  .header-transition-enter {
    background-color: ${props => props.fadeColor};
    transition: background-color ${fadeDuration*2}ms;
  }

  .header-transition-enter-done {
    transition: background-color ${fadeDuration*2}ms;
    background-color: ${props => props.fadeColor};
  }

  .header-transition-exit {
    background-color: ${props => props.fadeColor};
    transition: background-color ${fadeDuration*2}ms;
  }

  .header-transition-exit-done {
    background-color: ${props => props.fadeColor};
    transition: background-color ${fadeDuration*2}ms;
  }

  .text-transition-enter {
    color: ${props => props.fadeColor};
    opacity: 1;
    transition: color ${fadeDuration*2}ms;
  }

  .text-transition-enter-active {
    opacity: 0;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .text-transition-enter-done {
    color: ${props => props.fadeColor};
    opacity: 1;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .text-transition-exit {
    opacity: 1;
    color: ${props => props.fadeColor};
    transition: color ${fadeDuration*2}ms;
  }

  .text-transition-exit-active {
    opacity: 0;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .text-transition-exit-done {
    color: ${props => props.fadeColor};
    opacity: 1;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .author-transition-enter {
    color: ${props => props.fadeColor};
    opacity: 1;
    transition: color ${fadeDuration*2}ms;
  }

  .author-transition-enter-active {
    opacity: 0;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .author-transition-enter-done {
    color: ${props => props.fadeColor};
    opacity: 1;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .author-transition-exit {
    opacity: 1;
    color: ${props => props.fadeColor};
    transition: color ${fadeDuration*2}ms;
  }

  .author-transition-exit-active {
    opacity: 0;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .author-transition-exit-done {
    color: ${props => props.fadeColor};
    opacity: 1;
    transition: opacity ${fadeDuration}ms, color ${fadeDuration*2}ms;
  }

  .button-transition-enter {
    background-color: ${props => props.fadeColor};
    transition: background-color ${fadeDuration*2}ms;
  }

  .button-transition-enter-done {
    transition: background-color ${fadeDuration*2}ms;
    background-color: ${props => props.fadeColor};
  }

  .button-transition-exit {
    background-color: ${props => props.fadeColor};
    transition: background-color ${fadeDuration*2}ms;
  }

  .button-transition-exit-done {
    background-color: ${props => props.fadeColor};
    transition: background-color ${fadeDuration*2}ms;
  }
`;

class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false,
      isLoaded: false,
      error: null,
      randomColour: randomColour(),
      quoteArray: []
    };

    this.changeQuote = this.changeQuote.bind(this);
    this.changeAnimate = this.changeAnimate.bind(this);
    this.fetchQuotes = this.fetchQuotes.bind(this);
    this.changeColour = this.changeColour.bind(this);
  }

  controller = new AbortController();

  fetchQuotes() {
    let quoteDB = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';

    fetch(quoteDB, { signal: this.controller.signal })
      .then(response => response.json())
      .then(
        (data) => {
          this.setState({
            quoteArray: data.quotes,
            isLoaded: true,
            randomIndex: Math.floor(Math.random() * data.quotes.length)
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  changeQuote() {
    /* newRandomIndex() is called every time the changeQuote() function is called (when the user clicks new quote) 
    which checks if the current randomIndex is the same as newRandomIndex in order to prevent repeated quotes from appearing */  
    const newRandomIndex = () => { 
      let newRandomIndex = Math.floor(Math.random() * this.state.quoteArray.length);
      
      while (this.state.randomIndex === newRandomIndex) {
        newRandomIndex = Math.floor(Math.random() * this.state.quoteArray.length);
      }
      return newRandomIndex
    };

    const setQuote = () => {
      this.setState((prevState) => ({
        randomIndex: newRandomIndex(),
      }));
    };
    
    /* This conditional sets the first render to not have a timeout so that the quote immediately appears on the screen.
    Subsequent renders will then have a timeout set to the fadeDuration so that the states change after the fadeOut animations finish,
    or in other words when the fadeIn animations start. */
    setTimeout(() => {
      setQuote();
    }, fadeDuration);
  }

  changeAnimate() {
    this.setState((prevState) => ({
      animate: !prevState.animate
    }));
  }

  changeColour() {
    this.setState({
      randomColour: randomColour()
    });
  }

  // This is for a random quote to appear for every time the page loads
  componentDidMount() { 
    this.fetchQuotes();
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  render() {
    const { error, isLoaded, quoteArray, randomIndex } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <FadeDiv fadeColor={this.state.randomColour}>
          <CSSTransition in={this.state.animate} timeout={fadeDuration} classNames={'header-transition'}>
            <header id="App-header" className="wrapper">
              <div id="quote-box">
                <CSSTransition in={this.state.animate} timeout={fadeDuration} classNames={'text-transition'}>
                  <p id="text">{quoteLeft} {quoteArray[randomIndex].quote}</p>
                </CSSTransition>
                <CSSTransition in={this.state.animate} timeout={fadeDuration} classNames={'author-transition'}>
                  <p id="author">- {quoteArray[randomIndex].author}</p>
                </CSSTransition>
                <div id="button-box">
                  <CSSTransition in={this.state.animate} timeout={fadeDuration} classNames={'button-transition'}>
                    <button id="new-quote" onClick={() => {
                      this.changeAnimate();
                      this.changeQuote();
                      this.changeColour();
                    }}>New quote</button>
                  </CSSTransition>
                  <CSSTransition in={this.state.animate} timeout={fadeDuration} classNames={'tweet-transition'}>
                      <a id='tweet-quote' href=
                      {encodeURI(`http://www.twitter.com/intent/tweet?text=${quoteArray[randomIndex].quote} -${quoteArray[randomIndex].author}`)}>{twitter}</a>
                  </CSSTransition>
                </div>
              </div>
            </header>
          </CSSTransition>
        </FadeDiv>
      );
    }
  } 
}

export default QuoteBox;