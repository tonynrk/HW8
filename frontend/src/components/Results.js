import React, { Component } from 'react'
import qs from 'qs';
import styled from 'styled-components';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Loading from "./Loading";

const Styles = styled.div`
    .each_card{
        padding: 1rem;
    }
    .card{
        padding: 2rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 5px;
    }
`;

class Results extends Component {

    constructor(props) {
        super(props);
        const search = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        this.state = {
            q: search['q'],
            news: "plain",
            news_station: localStorage["station_news"]
        };
    }

    async getDataAxios() {

        let url;

        if (this.state.news_station === "NYTimesNews") {
            url = "/queryNYNews";
            url = url + "?q=" + this.state.q;
        } else {
            url = "/queryGuardianNews";
            url = url + "?q=" + this.state.q;
        }
        let response = await axios.get(url);
        try {
            if (this.state.news_station === "NYTimesNews") {
                this.setState({ news: response.data.response.docs });
            } else {
                
                this.setState({ news: response.data.response.results });
            }
        } catch{
            this.setState({ news: null });
        }

    }

    componentDidMount = () => {
        this.getDataAxios();
    }

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

    handleClickNews = (id,news_station) => {

        this.props.history.push("/article"+"?id="+id+"&news_station="+news_station);
    }

    each_news = (id, news_station , img, title, date, section, sect_txt_color, sect_bg_color) => {


        if (date !== "") {
            let year = date.substring(0, 4);
            let month = date.substring(5, 7);
            let day = date.substring(8, 10);

            date = year + '-' + month + '-' + day;
        }

        return (
            <Col className="each_card" md={3} >
                <Card onClick={(e) => {this.handleClickNews(id,news_station,e)}}>
                    <Card.Title>{title}</Card.Title>
                    <Card.Img src={img} style={{ marginBottom:"0.5rem" }}></Card.Img>
                    <Row>
                        <Col>
                            <p><i>{date}</i></p>
                        </Col>

                        {section !== "" ? 
                        <Col style={{ textAlign: 'right' }}>
                            <p className="tag" style={{ textTransform: 'uppercase', color: `${sect_txt_color}`, display: "inline-block", backgroundColor: `${sect_bg_color}`, padding: '3px', borderRadius: '5px' }}><b>{section}</b></p>
                        </Col> : <Col></Col>}
                    </Row>
                </Card>
            </Col>
        )
    };


    make_news = (my_news,news_station) =>{
        let id, img, title, date, section, sect_txt_color, sect_bg_color;
        if (news_station === "GuardianNews") {
            const jsx = my_news.map(a_news => {
                id = a_news['id'];
                try{
                    img = a_news['blocks']['main']['elements'][0]['assets'].slice(-1)[0]['file'];
                }catch{
                    img = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
                }
                title = a_news['webTitle'];
                section = a_news['sectionId'];
                date = a_news['webPublicationDate'];
                sect_txt_color = this.mapping_section(section)["txt_color"];
                sect_bg_color = this.mapping_section(section)["bg_color"];
                return this.each_news(id, news_station , img, title, date, section, sect_txt_color, sect_bg_color);
            });
            return jsx;
        }else{
            const jsx = my_news.map(a_news => {
                id = a_news['web_url'];
                
                img = null;

                try{
                    for (let i = 0; i < a_news.multimedia.length; i++) {
                        if (a_news.multimedia[i]['width'] >= 2000) {
                            img = "https://www.nytimes.com/" + a_news.multimedia[i]['url'];
                            break;
                        }
                    }
                }catch{
                    img = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                }
                if (img === null) {
                    img = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                }
                title = a_news['headline']['main']
                section = a_news['news_desk'];
                date = a_news['pub_date'];
                sect_txt_color = this.mapping_section(section)["txt_color"];
                sect_bg_color = this.mapping_section(section)["bg_color"];
                return this.each_news(id, news_station , img, title, date, section, sect_txt_color, sect_bg_color);
            });
            return jsx;
        }
    }




    render() {

        let my_news = this.state.news;
        if (my_news !== "plain") {
            if (my_news !== null) {

                let jsx = this.make_news(my_news, this.state.news_station);

                return (
                    <Styles>
                        <Container fluid>
                            <h3>Results</h3>
                            <Row>
                                {jsx}
                            </Row>
                        </Container>
                    </Styles>
                );

            } else {
                return (<p>error</p>)
            }
        } else {
            return (<Loading />)
        }
    }




    
}

export default withRouter(Results);