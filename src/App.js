import React, { Component } from 'react';
import loader from './images/loader.svg';
import Gif from './Gif';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}

const Header = ({clearSearch, hasResults}) => (
	<div className="header grid">	
		{hasResults ? (
			<button onClick={clearSearch}>
				<img src={clearButton} />
			</button>
			) : (
				<h1 className="title">Jiffy</h1>
		)}
	</div>

)

const UserHint= ({loading, hintText}) => (
	<div className='user-hint'>
		{loading ? <img className='block mx-auto' src={loader} /> : 
		hintText}
	</div>
)

// We want a function that searchs GIPHY API using fetch and puts the search term in the query URL
// Then, we can do something with the results



class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			searchTerm: '',
			hintText: '',
			gifs: [],
			loading: false
		};
	}

	searchGiphy = async (searchTerm) => {
		/* Set state of loading to true, so the spinner is shown */
		this.setState({
			loading: true
		})

		try {
			const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=MsKzOAaaZ7bOMPXKeCUebbNSVaLQCf1c&q=${searchTerm}&limit=25&offset=0&rating=PG&lang=en`);
			// Wait and let it happen in the background
			const {data} = await response.json();

			// Here we check if the array is empty
			// If so, we throw an error which will stop
			// the code here and handle it in catch area

			if (!data.length) {
				throw `Nothing found for ${searchTerm}`
			}

			const randomGif = randomChoice(data)

			this.setState((prevState, props) => ({
				...prevState,
				// We use spread to take and add previous gifs, then add new random one
				gifs: [...prevState.gifs, randomGif],
				loading: false,
				hintText: `Hit enter to see more ${searchTerm}`
			}))


		} catch (error) {
			this.setState((prevState, props) => ({
				...prevState,
				hintText: error,
				loading: false
			}))
		}

	}

	handleChange = event => {
		const {value} = event.target;
		this.setState((prevState, props) => ({
			// Take old props, spread them out, then overwrite
			...prevState, 

			searchTerm: value,
			
			// Set hint text only when we have more than 2 values in input
			hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
		}));
	}

	handleKeyPress = event => {
		const {value} = event.target

		if(value.length>2 && event.key === 'Enter') {
			// Call searchGiphy function and give it value from input
			this.searchGiphy(value);
		}

	}

	// Reset state by clearing everything out and making it default again

	clearSearch = () => {
		this.setState((prevState, props) => ({
			...prevState,
			searchTerm: '',
			hintText: '',
			gifs: []
		}))

		// grab the input then focus cursor back in type area
		this.textInput.focus();
	}

	// when we have two or more characters in our search box AND press enter, we want to run a search
  render() {

  	const {searchTerm, gifs} = this.state
  	const hasResults = gifs.length

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        
        <div className="search grid">
        	{/* Loop over gif array and create multiple videos from it */}

	        {this.state.gifs.map(gif => 
	        	/* Spread out all of props from gif */
	        	<Gif {...gif} />

	        )}


        	<input className="input grid-item" placeholder="Type something" 
        	onChange={this.handleChange}
        	onKeyPress={this.handleKeyPress}
        	value = {searchTerm}
        	ref={input => {
        		this.textInput = input;
        	}}
        	/>
        </div>

        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
