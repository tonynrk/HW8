import React, { Component } from 'react';
import qs from 'qs';
import styled from 'styled-components';
import { Container, Row, Card, Accordion, Col,} from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import PageWithComments from "./PageWithComments";
import Loading from "./Loading";
// import scrollToComponent from 'react-scroll-to-component';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, EmailShareButton, TwitterShareButton} from 'react-share';
import { FaBookmark,FaRegBookmark } from 'react-icons/fa';
import ReactTooltip from "react-tooltip";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Toaster.css';

const Styles = styled.div`

    .card{
        padding: 2rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 5px;
    }
`;



class Article extends Component {

    constructor(props) {
        super(props);
        const search = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        let info = JSON.parse(localStorage.getItem('bookmark_news'));
        let id2 =  search['news_station']==="NYTimesNews" ? search['id'] : "https://www.theguardian.com/"+search['id'];
        this.state = {
            id: search['id'],
            news: "plain",
            news_station: search['news_station'],
            isOpen: false,
            ref: React.createRef(),
            bookmark_article: id2 in info ? true : false,
            news_section: search["news_section"]
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleBookmark = this.handleBookmark.bind(this);
    }

    handleBookmark = (id,title,details) => {

        this.state.bookmark_article === false ? toast("Saving "+title) : toast('Removing '+title); 
        let info = JSON.parse(localStorage.getItem('bookmark_news'));
        if( !(id in info) ){
            info[id] = details;
            
        }else{
            delete info[id]
        }
        localStorage.setItem('bookmark_news', JSON.stringify(info));

        this.setState({bookmark_article:!this.state.bookmark_article});
        
    }
    async getDataAxios() {

        let url;

        if (this.state.news_station === "NYTimesNews") {
            url = "/searchNYNews";
            url = url + "?web_url=" + this.state.id;
        } else {
            url = "/searchGuardianNews";
            url = url + "?id=" + this.state.id;
        }
        let response = await axios.get(url);
        console.log(response);
        try {

            if (this.state.news_station === "NYTimesNews") {
                this.setState({ news: response.data });
            } else {
                this.setState({ news: response.data.response.content });
            }
        } catch{
            this.setState({ news: null });
        }

    }

    componentDidMount = () => {
        this.getDataAxios();
    }

    make_news = (my_news, news_station) => {
        
        let a_news, title, multimedia, img, date, description;

        let id2 = news_station==="NYTimesNews" ? this.state.id : "https://www.theguardian.com/"+this.state.id;

        if (news_station === "NYTimesNews") {

            a_news = my_news['response']['docs'][0];

            title = a_news['headline']['main'];
            multimedia = a_news['multimedia']
            img = null;

            try{
                for (let i = 0; i < multimedia.length; i++) {
                    if (multimedia[i]['width'] >= 2000) {
                        img = "https://www.nytimes.com/" + multimedia[i]['url'];
                        break;
                    }
                }
            }catch{
                img = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            }
            if (img === null) {
                img = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            }
            date = a_news['pub_date']

            if (date !== "") {
                let year = date.substring(0, 4);
                let month = date.substring(5, 7);
                let day = date.substring(8, 10);

                date = year + '-' + month + '-' + day;
            }

            description = a_news['abstract']

        } else {
            a_news = my_news;
            title = a_news['webTitle'];
            multimedia = null;

            try {
                img = a_news['blocks']['main']['elements'][0]['assets'].slice(-1)[0]['file']
            } catch{
                img = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
            }

            date = a_news['webPublicationDate']

            if (date !== "") {
                let year = date.substring(0, 4);
                let month = date.substring(5, 7);
                let day = date.substring(8, 10);

                date = year + '-' + month + '-' + day;
            }

            description = a_news['blocks']['body'][0]['bodyTextSummary'];

        }
        let details = {
            id:this.state.id,
            news_station:this.state.news_station,
            img:img,
            title:title,
            date:date,
            section:this.state.news_section
        }

        if (description.split(/[.?!]\s/).length <= 4) {

            return (
                <Styles>
                    <div style={{ padding: "1rem" }} >
                        <Container fluid>
                            <Row>
                                <Card>
                                    <Card.Title><h3><i>{title}</i></h3></Card.Title>
                                    <Row>
                                        <Col xs={5}>
                                            <p><i>&nbsp;&nbsp;{date}</i></p>
                                        </Col>
                                        <Col xs={5} style={{textAlign:"right"}}>
                                            <FacebookShareButton data-tip="Facebook" data-for="exp_page" url={id2} hashtag="#CSCI_571_NewsApp">
                                                <FacebookIcon size={"2rem"} round={true} />
                                            </FacebookShareButton>
                                            <TwitterShareButton data-tip="Twitter" data-for="exp_page" url={id2} hashtags={["CSCI_571_NewsApp"]}>
                                                <TwitterIcon size={"2rem"} round={true} />
                                            </TwitterShareButton>
                                            <EmailShareButton data-tip="Email" data-for="exp_page" url={id2} subject="#CSCI_571_NewsApp">
                                                <EmailIcon size={"2rem"} round={true} />
                                            </EmailShareButton>
                                        </Col>
                                        <Col style={{textAlign:"right"}}>
                                                
                                            <span data-tip="Bookmark" data-for="exp_page">{ this.state.bookmark_article === true ? <FaBookmark color="red" size={"2rem"}  onClick={(e) => this.handleBookmark(id2,title,details,e)} /> : <FaRegBookmark color="red"  size={"2rem"} onClick={(e) => this.handleBookmark(id2,title,details,e)} />}</span>
                                        </Col>
                                    </Row>
                                    <Card.Img style={{borderRadius: "0px"}} src={img}></Card.Img>
                                    <Card.Text>{description}</Card.Text>
                                </Card>
                            </Row>
                        </Container>
                    </div>
                </Styles>
            )

        } else {
            let dot4index = 0;
            let index = null;
            for (let i = 0; i < description.length; i++) {
                if (description.charAt(i) === ".") {
                    dot4index += 1;
                }
                if (dot4index === 4) {
                    index = i;
                    break;
                }
            }
            let description_1 = description.substring(0, index + 1);
            let description_2 = description.substring(index + 1);

            return (
                <Styles>
                    <Container fluid>
                        <Accordion defaultActiveKey="2">
                            <Row style={{padding:"1rem"}}>
                                <Card style={{ position: "relative",cursor:"pointer" }}>
                                    <Card.Title><h3><i>{title}</i></h3></Card.Title>
                                    <Row>
                                        <Col xs={5}>
                                            <p><i>&nbsp;&nbsp;{date}</i></p>
                                        </Col>
                                        <Col xs={5} style={{textAlign:"right"}}>
                                            <FacebookShareButton data-tip="Facebook" data-for="exp_page" url={id2} hashtag="#CSCI_571_NewsApp">
                                                <FacebookIcon size={"2rem"} round={true} />
                                            </FacebookShareButton>
                                            <TwitterShareButton data-tip="Twitter" data-for="exp_page" url={id2} hashtags={["CSCI_571_NewsApp"]}>
                                                <TwitterIcon size={"2rem"} round={true} />
                                            </TwitterShareButton>
                                            <EmailShareButton data-tip="Email" data-for="exp_page" url={id2} subject="#CSCI_571_NewsApp">
                                                <EmailIcon size={"2rem"} round={true} />
                                            </EmailShareButton>
                                        </Col>
                                        <Col style={{textAlign:"right"}}>
                                                
                                            <span data-tip="Bookmark" data-for="exp_page">{ this.state.bookmark_article === true ? <FaBookmark color="red" size={"2rem"}  onClick={(e) => this.handleBookmark(id2,title,details,e)} /> : <FaRegBookmark color="red"  size={"2rem"} onClick={(e) => this.handleBookmark(id2,title,details,e)} />}</span>
                                        </Col>
                                    </Row>
                                    <Card.Img style={{borderRadius: "0px"}} src={img}></Card.Img>
                                    <Card.Text>{description_1}</Card.Text>
                                    <Accordion.Collapse>
                                        <Card.Text >{description_2}</Card.Text>
                                    </Accordion.Collapse>

                                    <Accordion.Toggle style={{ position: "absolute", bottom: "0", right: "0", backgroundColor: "#FFFFFF",border:"none",cursor:"pointer"  }} onClick={() => this.toggleCollapse()}>
                                        {this.state.isOpen ? (<IoIosArrowUp />) : (<IoIosArrowDown />)}
                                    </Accordion.Toggle>
                                </Card>
                            </Row>

                        </Accordion>
                    </Container>
                </Styles>
            )

        }


    }

    toggleCollapse = () => {
        
        this.setState({ isOpen: !this.state.isOpen });
        if(this.state.isOpen === false){
            this.state.ref.current.scrollIntoView({ behavior: "smooth", block: 'start' });
            // scrollToComponent(this.Desc,{ offset: 10, align: 'bottom', duration: 500, ease:'inCirc'});
        }
    }


    render() {
        
        let my_news = this.state.news;
        if (my_news !== "plain") {
            if (my_news !== null) {

                let jsx = this.make_news(my_news, this.state.news_station)
                try {
                    this.props.functionName()
                }catch{

                }
                return (
                                  
                        <div>
                            {jsx}

                            <ToastContainer toastClassName="toast-alert" transition={Zoom} position="top-center" autoClose={2000} hideProgressBar={true} />
                            <ReactTooltip place="top" type="dark" effect="solid" id="exp_page" />
                            <Container fluid>
                                <PageWithComments id={this.state.id}  />
                            </Container>
                            <p ref={this.state.ref}></p>
                        </div>
                    
                );

            } else {
                return (<p>error</p>)
            }
        } else {
            return (<Loading />)
        }
    }
}

export default withRouter(Article);