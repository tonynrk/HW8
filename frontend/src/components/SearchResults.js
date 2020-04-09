import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import styled from 'styled-components';
import _ from "lodash";
import {withRouter} from 'react-router-dom';

const Styles = styled.div`

    .mySelect{
        min-width: 350px;
        
    }

    @media screen and (min-width: 768px) {
        .mySelect{
         min-width: 200px;
        }
    }
`

class SearchResults extends Component {

    constructor(props){
        super(props);
        this.state = {results: [], keyword:''};
        this.handleSearchChange = _.debounce(this.handleSearchChange.bind(this),1500,{
            leading:true
        });
    }

    delay = (t, val) => {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(val);
            }, t);
        });
     }

    async handleSearchChange(){
        await this.delay(1000);

        console.log("my keyword: " + this.state.keyword)
        const keyword = this.state.keyword;
        
        try{
            const response = await fetch(
                `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?mkt=fr-FR&q=${keyword}`,
                {
                  headers: {
                    "Ocp-Apim-Subscription-Key": "7d15eededbee4012aa039d8634e48dd8"
                  }
                }
              );
            const data = await response.json();
            
            const resultsRaw = data.suggestionGroups[0].searchSuggestions;
            
            const results = resultsRaw.map(result => ({ label: result.displayText, value: result.displayText }));

            return results
        }catch{
            console.log("error");
        }
    }

    onInputStringChange = (newValue) => {
        this.setState({keyword: newValue});
        return newValue;
    }
    
    handleSelectNews = (select) => {
        console.log(select.label);
        this.props.history.push("/search"+"?q="+select.label);

    }

    render() {
        
        return (
            <Styles>
                <AsyncSelect className="mySelect"
                    loadOptions={this.handleSearchChange} 
                    onInputChange={this.onInputStringChange} 
                    placeholder="Enter Keyword.."
                    onChange={(e,select) => {this.handleSelectNews(e,select)}}
                    />
            </Styles>
        )
        
    }
}

export default withRouter(SearchResults);