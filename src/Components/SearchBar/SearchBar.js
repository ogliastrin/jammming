import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: ""};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }


  search() {
    this.props.onSearch(this.state.term);
  }


  handleTermChange(e) {
    this.setState({term: e.target.value});
  }


  handleEnter(e) {
   if (e.keyCode === 13) {
     this.props.onSearch(this.state.term);
   }
 }


  render() {
    return (
      <div className="SearchBar">
        <input
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
          onKeyDown={this.handleEnter} />
        <button
          className="SearchButton"
          onClick={this.search}>SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;
