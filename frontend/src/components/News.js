import React, { Component } from 'react'
import styled from 'styled-components';
import { Container, Row, Col, Image, Modal } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Loading from "./Loading";
import { MdShare } from 'react-icons/md';
import {EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, EmailShareButton, TwitterShareButton} from 'react-share';

const Styles = styled.div`

    .container-fluid{
        padding: 2rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 5px;
        cursor: pointer;
    }
    .description {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

`;

class News extends Component {

    constructor(props) {
        super(props);
        let param_section;
        if (Object.keys(this.props.match.params).length === 0) {
            param_section = "home";
        } else {
            param_section = this.props.match.params.section;
        }
        this.state = {
            section: param_section,
            news: "plain",
            checkGetUpdate: false,
            show: false,
            share: false,
            id: null
        };
        this.handleClickNews = this.handleClickNews.bind(this)
    }

   
    async getDataAxios() {

        if (localStorage["station_news"] === "GuardianNews") {

            // Guardian News
            let url = "/getGuardianNews";
            let response = await axios.get(url + "?section=" + this.state.section);
            try {
                this.setState({ news: response.data, checkGetUpdate: true });
            } catch{
                this.setState({ news: null, checkGetUpdate: true });
            }

        } else if (localStorage["station_news"] === "NYTimesNews") {

            let url = "/getNYTimesNews";
            let response = await axios.get(url + "?section=" + this.state.section);
            try {
                this.setState({ news: response.data, checkGetUpdate: true });
            } catch{
                this.setState({ news: null, checkGetUpdate: true });
            }
        }



    }

    componentDidMount = () => {
        this.getDataAxios();
    }
    

    handleClickNews = (id, news_station, news_section) => {
        if(this.state.share === false){
            this.props.history.push("/article" + "?id=" + id + "&news_station=" + news_station + "&news_section=" + news_section);
        }else{
            this.setState({share:false});
        }

    }

    handleClose = () => {
        this.setState({ show: false, id: null  });
    }

    handleShare = (id,e) => {
        
        this.setState({ show: true, share:true, id: id });
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
    }

    handleOutsideWindow = (e) => {
        this.setState({ show: false });
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }


    each_news = (id, news_station, image, title, description, date, section, sect_txt_color, sect_bg_color) => {


        if (date !== "") {
            let year = date.substring(0, 4);
            let month = date.substring(5, 7);
            let day = date.substring(8, 10);

            date = year + '-' + month + '-' + day;
        }

        let id2 = news_station==="NYTimesNews" ? id : "https://www.theguardian.com/"+id

        return (
            <div style={{ padding: "1rem" }} >
                <Container fluid onClick={(e) => this.handleClickNews(id, news_station, section, e)} key={id}>
                    <Row>
                        <Col md={3}>
                            <Container fluid style={{padding:"0.25rem",boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)"}}>
                                <Image src={image} fluid />
                            </Container>

                        </Col>
                        <Col md={9}>
                            <span><h5><i>{title}<MdShare onClick={(e) => this.handleShare(id,e)} /></i></h5></span>
                            <p className="description">{description}</p>

                            <Row>
                                <Col>
                                    <p><b><i>{date}</i></b></p>
                                </Col>
                                <Col style={{ textAlign: 'right' }}>
                                    <p className="tag" style={{ textTransform: 'uppercase', color: `${sect_txt_color}`, display: "inline-block", backgroundColor: `${sect_bg_color}`, padding: '3px', borderRadius: '5px' }}><b>{section}</b></p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Modal show={this.state.id === id} onHide={this.handleClose} onClick={this.handleOutsideWindow} key={id}>
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{textAlign:'center'}}> 
                            <h4>Share via</h4>
                            <Row>
                                <Col>
                                    <FacebookShareButton url={id2} hashtag="#CSCI_571_NewsApp">
                                        <FacebookIcon size={"4rem"} round={true} />
                                    </FacebookShareButton>
                                </Col>
                                <Col>
                                    <TwitterShareButton url={id2} hashtags={["CSCI_571_NewsApp"]}>
                                        <TwitterIcon size={"4rem"} round={true} />
                                    </TwitterShareButton>
                                </Col>
                                <Col>
                                    <EmailShareButton url={id2} subject="#CSCI_571_NewsApp">
                                        <EmailIcon size={"4rem"} round={true} />
                                    </EmailShareButton>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                </Container>
            </div>);
    };


    mapping_section = (section) => {
        let txt_color, bg_color;
        switch (section) {
            case "world":
                txt_color = "#FFFFFF";
                bg_color = "#794CFF";
                break;
            case "politics":
                txt_color = "#FFFFFF";
                bg_color = "#3E9386";
                break;
            case "business":
                txt_color = "#FFFFFF";
                bg_color = "#4696EC";
                break;
            case "technology":
                txt_color = "#000000";
                bg_color = "#CEDB3A";
                break;
            case "sports":
                txt_color = "#000000";
                bg_color = "#F6C243";
                break;
            default:
                txt_color = "#FFFFFF";
                bg_color = "#6E757D";

        }
        return { "txt_color": txt_color, "bg_color": bg_color }

    }


    render() {

        let my_news = this.state.news;


        try {
            this.props.functionName()
        }catch{

        }

        try {

            if (localStorage['station_news'] === "NYTimesNews") {
                const jsx = my_news.map(a_news => {

                    let a_id = a_news['url'];
                    let a_news_station = "NYTimesNews"
                    let a_image = null;
                    try {
                        for (let i = 0; i < a_news['multimedia'].length; i++) {
                            let width = a_news['multimedia'][i]['width'];
                            if (width >= 2000) {
                                a_image = a_news['multimedia'][i]['url'];
                                break;
                            }
                        }
                    } catch{
                        a_image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                    }

                    if (a_image === null) {
                        a_image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                    }


                    let a_title = a_news['title'];
                    let a_section = a_news['section'];
                    let a_date = a_news['published_date'];
                    let a_description = a_news['abstract'];
                    let a_sect_txt_color = this.mapping_section(a_section)["txt_color"];
                    let a_sect_bg_color = this.mapping_section(a_section)["bg_color"];

                    return this.each_news(a_id, a_news_station, a_image, a_title, a_description, a_date, a_section, a_sect_txt_color, a_sect_bg_color)
                });
                return (<Styles>{jsx}</Styles>);
            } else {
                const jsx = my_news.map(a_news => {
                    let a_id = a_news['id'];
                    let a_news_station = "GuardianNews"
                    let a_image;

                    try {
                        a_image = a_news['blocks']['main']['elements'][0]['assets'].slice(-1)[0]['file']
                    } catch{
                        a_image = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
                    }

                    let a_title = a_news['webTitle'];
                    let a_section = a_news['sectionId'];
                    let a_date = a_news['webPublicationDate'];
                    let a_description = a_news['blocks']['body'][0]['bodyTextSummary'];
                    let a_sect_txt_color = this.mapping_section(a_section)["txt_color"];
                    let a_sect_bg_color = this.mapping_section(a_section)["bg_color"];

                    return this.each_news(a_id, a_news_station, a_image, a_title, a_description, a_date, a_section, a_sect_txt_color, a_sect_bg_color)
                });
                return (<Styles>{jsx}</Styles>);
            }



        } catch{
            if (this.state.news !== "plain") {
                return (<p>error</p>)
            } else {
                return (<Loading />)
            }
        }
    }
}

export default withRouter(News);