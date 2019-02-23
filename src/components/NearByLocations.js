
import SingleLocationOnMap from './SingleLocationOnMap';
import React, { Component } from 'react';

/**
 * NearByLocations component.
 */
class NearByLocations extends Component {
    constructor(props) {
        super(props);
        // Initial state.
        this.state = {
            myLocations: null,
            searchQuery: '',
            isSuggestionDisplayed: true
        };

        this.filterLocations = this.filterLocations.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

    componentWillMount() {
        this.setState({
            myLocations: this.props.allMyLocations
        });
    }

    /**
     * Filter Locations based on user query input.
     */
    filterLocations(event) {
        this.props.closeInfoWindow();
        const { value } = event.target;
        var locations = [];
        this.props.allMyLocations.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            myLocations: locations,
            searchQuery: value
        });
    }

    /**
     * Toggle suggestions
     */
    toggleSuggestions() {
        this.setState({
            isSuggestionDisplayed: !this.state.isSuggestionDisplayed
        });
    }

    /**
     * Render function of NearByLocations Component.
     */
    render() {
        var allLocationsList = this.state.myLocations.map(function (singleLocation, index) {
            return (
                <SingleLocationOnMap key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={singleLocation} />
            );
        }, this);

        return (
            <div className="filter">
                <input role="search" aria-labelledby="filter" id="search-field" className="filter-field" type="text" placeholder="Filter"
                    value={this.state.searchQuery} onChange={this.filterLocations} />
                <ul>
                    {this.state.isSuggestionDisplayed && allLocationsList}
                </ul>
                <button className="button" onClick={this.toggleSuggestions}>
                    {this.state.isSuggestionDisplayed === true ? "Hide Suggestions" : "Show Suggestions"}</button>
            </div>
        );
    }
}

export default NearByLocations;