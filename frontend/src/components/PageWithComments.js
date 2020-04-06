import React from 'react';
import commentBox from 'commentbox.io';

export default class PageWithComments extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount() {

        this.removeCommentBox = commentBox('5686006120448000-proj');
    }

    componentWillUnmount() {

        this.removeCommentBox();
    }

    render() {

        return (
            <div className="commentbox" {...this.props} id={this.props.id} key={this.props.id} />
        );
    }
}