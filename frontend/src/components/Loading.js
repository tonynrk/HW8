import React, { Component } from 'react'
import { css } from "@emotion/core";
import {BounceLoader} from "react-spinners";
import {Container} from "react-bootstrap";


const override = css`
  display: block;
  margin: 25% auto;
  margin-bottom: 0;
  border-color: blue;
  color: black;
`;

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true
        };
      }
     
      render() {
        return (
            <Container fluid>
                {/* <div style={{position:"fixed",top:"50%",left:"50%"}} >
                  <Spinner animation="grow" variant="primary" />
                  
                </div> */}
                <BounceLoader
                  css={override}
                  size={150}
                  color={"#123abc"}
                  loading={this.state.loading}
                />
                <h3 style={{textAlign:"center"}}>Loading</h3>
            </Container>
        );
      }
}
