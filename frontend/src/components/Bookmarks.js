import React, { Component } from 'react'
import './styles/Tag.css'
import styled from 'styled-components';
import { Container, Row, Col, Card, Modal} from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdShare } from 'react-icons/md';
import {EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, EmailShareButton, TwitterShareButton} from 'react-share';
import {FaTrashAlt} from 'react-icons/fa';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/Toaster.css';

const Styles = styled.div`
    .each_card{
        padding: 1rem;
    }
    .card{
        padding: 1.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 5px;
    }
`;

const mapping_section = (section) => {
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

const mapping_news_station = (news_station) => {
    let txt_color, bg_color;
    switch (news_station) {
        case "GuardianNews":
            txt_color = "#FFFFFF";
            bg_color = "#14284A";
            break;
        default:
            txt_color = "#00000";
            bg_color = "#DADADA";

    }
    return { "txt_color": txt_color, "bg_color": bg_color }
}


class Bookmarks extends Component {

    constructor(props){
        super(props);
        this.state = {
            bookmark_news:  JSON.parse(localStorage.getItem('bookmark_news')),
            show: false,
            share: false,
            id: null,
            show_del: true
        }
    }

    handleClickNews = (id,news_station,news_section) => {
        this.props.history.push("/article"+"?id="+id+"&news_station="+news_station+"&news_section=" + news_section);
    }
    handleShare = (id,e) => {
        
        this.setState({ show: true, share:true, id: id });
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
    }

    handleClose = () => {
        this.setState({ show: false, id: null  });
    }

    handleOutsideWindow = (e) => {
        this.setState({ show: false });
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
    }

    handleTrash = (id_object,title,e) => {

        let info = JSON.parse(localStorage.getItem('bookmark_news'));
        delete info[id_object]
        localStorage.setItem('bookmark_news', JSON.stringify(info));

        this.setState({bookmark_news:info});
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
        this.state.show_del === true ? toast("Removing " + title) : toast("Removing " + title);

    }

    each_news = (id, news_station , img, title, date, section, sect_txt_color, sect_bg_color, station_txt_color, station_bg_color) => {


        if (date !== "") {
            let year = date.substring(0, 4);
            let month = date.substring(5, 7);
            let day = date.substring(8, 10);

            date = year + '-' + month + '-' + day;
        }
        let id2 = news_station==="NYTimesNews" ? id : "https://www.theguardian.com/"+id

        return (
            <Col className="each_card" md={3} >
                <Card style={{cursor:"pointer"}} onClick={(e) => {this.handleClickNews(id,news_station,section,e)}}>
                    <Card.Title className="card_title">{title}<MdShare onClick={(e) => this.handleShare(id,e)} /><FaTrashAlt onClick={(e) => this.handleTrash(id2,title,e) } /> </Card.Title>
                    <Card.Img src={img} style={{ marginBottom:"0.5rem" }}></Card.Img>
                    <Row>
                        <Col>
                            <p className="date"><i>{date}</i></p>
                        </Col>

                        {section !== "" ? 
                        <Col style={{ textAlign: 'right' }}>
                            <span> <p className="news_station" style={{marginRight:'2px',color: `${station_txt_color}`, backgroundColor: `${station_bg_color}`}}><b>{ news_station==="NYTimesNews" ? "NYTimes" : "Guardian" }</b></p>
                            <p className="section" style={{color: `${sect_txt_color}`, backgroundColor: `${sect_bg_color}`}}><b>{section}</b></p> 
                            </span>   
                        </Col> : <Col> <p className="news_station" style={{color: `${station_txt_color}`, backgroundColor: `${station_bg_color}`}}><b>{news_station}</b></p> </Col>}
                    </Row>
                </Card>
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

            </Col>
        )
    };
    
    make_news = (my_news) =>{
        const values = Object.values(my_news);
        const jsx = values.map(a_news => {
            let id = a_news['id'];
            let news_station = a_news['news_station'];
            let img = a_news['img'];
            let title = a_news['title'];
            let date = a_news['date'];
            let section = a_news['section'];
            

            let sect_txt_color = mapping_section(section)["txt_color"];
            let sect_bg_color = mapping_section(section)["bg_color"];
            let station_txt_color = mapping_news_station(news_station)["txt_color"];
            let station_bg_color = mapping_news_station(news_station)["bg_color"];


            return this.each_news(id, news_station , img, title, date, section, sect_txt_color, sect_bg_color, station_txt_color, station_bg_color);
        });
        return jsx;

    }


    


    render() {
        
        let my_news = this.state.bookmark_news;
        try {
            this.props.functionName()
        }catch{

        }
        let jsx = this.make_news(my_news);
        
        return (
            <Styles>
                {Object.keys(my_news).length !== 0 ? 
                    <Container fluid>
                        <h3>Results</h3>
                        <Row>
                            {jsx}    
                        </Row>
                    </Container>
                :
                    <Container fluid>
                        <h3 style={{textAlign:"center"}}>You have no saved articles</h3>
                    </Container>
                }
                <ToastContainer toastClassName="toast-alert" transition={Zoom} position="top-center" autoClose={1000} hideProgressBar={true} />                          
            </Styles>
        );



    }
}

export default withRouter(Bookmarks);