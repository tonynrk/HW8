import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from 'react-switch';
import SearchResults from './SearchResults';
import { FaBookmark,FaRegBookmark } from 'react-icons/fa';
import {withRouter} from 'react-router-dom';
import ReactTooltip from "react-tooltip";

const Styles = styled.div`

    @media screen and (max-width: 576px) {
        .form-inline{
            width:80%;
        }
        .form-control{
            width:100%;
        }

    }

    .navbar {
        background-image: linear-gradient(to right, #202C56 , #4F6BB3);
    
`;

class NavigationBar extends Component {

    constructor(props){
        super(props)

        if(!("bookmark_news" in localStorage)){
            localStorage.setItem("bookmark_news", JSON.stringify({}));
        }

        if(!("station_news" in localStorage)){
            localStorage.setItem("station_news","GuardianNews");
        }else{
            let retrievedObject = localStorage.getItem("station_news")
            localStorage.setItem("station_news",retrievedObject);
        }
        
        if(localStorage["station_news"] === "GuardianNews"){
            this.state = {checked:true};
        }
        else if (localStorage["station_news"] === "NYTimesNews"){
            this.state = {checked:false};
        }
        this.state = { ...this.state, bookmark: false};
        this.handleBookmark = this.handleBookmark.bind(this);
        this.handleLink = this.handleLink.bind(this);
    }

    handleBookmark = () => {
        this.setState({bookmark:!this.state.bookmark});
    }

    handleLink = () => {
        this.setState({bookmark:false});
    }

    handleChange = (checked) => {
        this.setState({checked});
        if(checked){
            localStorage["station_news"] = "GuardianNews";
        }else{
            localStorage["station_news"] = "NYTimesNews";
        }
        window.location.reload();
    }

    render() {

        return (
            <Styles>
                <Navbar bg="dark" variant="dark" expand="md">
                
                    <SearchResults />
                    <Navbar.Toggle className="ml-auto" aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link to="/" href= "/" onClick={this.handleLink} exact as={NavLink}>Home</Nav.Link>
                            <Nav.Link to="/world" href="/world" onClick={this.handleLink} exact as={NavLink}>World</Nav.Link>
                            <Nav.Link to="/politics" href="/politics" onClick={this.handleLink} exact as={NavLink}>Politics</Nav.Link>
                            <Nav.Link to="/business" href="/business" onClick={this.handleLink} exact as={NavLink}>Business</Nav.Link>
                            <Nav.Link to="/technology" href="/technology" onClick={this.handleLink} exact as={NavLink}>Technology</Nav.Link>
                            <Nav.Link to="/sports" href="/sports" onClick={this.handleLink} exact as={NavLink}>Sports</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link onClick={this.handleBookmark} to="/bookmarks" href= "/bookmarks" exact as={NavLink} data-tip="Bookmarks" >{this.state.bookmark ? <FaBookmark /> : <FaRegBookmark />}</Nav.Link>
                            <Nav.Link disabled style={{color:"white"}}>NYTimes</Nav.Link>
                            <Nav.Link><Switch onChange={this.handleChange} checked={this.state.checked} onColor="#86d3ff" onHandleColor="#2693e6"
                            handleDiameter={14} uncheckedIcon={false} checkedIcon={false} boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" height={10} width={30} className="react-switch" 
                            id="material-switch"></Switch></Nav.Link>
                            <Nav.Link disabled style={{color:"white"}}>Guardian</Nav.Link>
                        </Nav>
                        <ReactTooltip place="bottom" type="dark" effect="solid"/>
                    </Navbar.Collapse>
                </Navbar>
            </Styles>
        )
    }
}

export default withRouter(NavigationBar);