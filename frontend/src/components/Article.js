import React, { Component } from 'react';
import qs from 'qs';
import styled from 'styled-components';
import { Container, Row, Card, Accordion } from 'react-bootstrap';
import { withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import PageWithComments from "./PageWithComments";
import Loading from "./Loading";
import scrollToComponent from 'react-scroll-to-component';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io"

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
        this.state = {
            id: search['id'],
            news: "plain",
            news_station: search['news_station'],
            isOpen: false
        };
        this.myRef = React.createRef(); 
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

        if (description.split(/[.?!]\s/).length <= 4) {

            return (
                <Styles>
                    <div style={{ padding: "1rem" }} >
                        <Container fluid>
                            <Row>
                                <Card>
                                    <Card.Title>{title}</Card.Title>
                                    <p>{date}</p>
                                    <Card.Img src={img}></Card.Img>
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
                                <Card style={{ position: "relative" }}>
                                    <Card.Title>{title}</Card.Title>
                                    <p>{date}</p>
                                    <Card.Img src={img}></Card.Img>
                                    <Card.Text>{description_1}</Card.Text>
                                    <Accordion.Collapse>
                                        <Card.Text >{description_2}</Card.Text>
                                    </Accordion.Collapse>

                                    <Accordion.Toggle style={{ position: "absolute", bottom: "0", right: "0", backgroundColor: "#FFFFFF",border:"none"  }} onClick={() => this.toggleCollapse()}>
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

            scrollToComponent(this.Desc,{ offset: 10, align: 'bottom', duration: 500, ease:'inCirc'});
        }
    }


    render() {
        let my_news = this.state.news;
        if (my_news !== "plain") {
            if (my_news !== null) {

                let jsx = this.make_news(my_news, this.state.news_station)

                return (
                    <div>
                        {jsx}
                        <PageWithComments id={this.state.id} ref={(section) => { this.Desc = section; }}  />
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