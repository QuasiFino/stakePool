import React, {Component} from 'react';
import {Item} from 'semantic-ui-react';


class Element extends Component{
    static async getInitialProps(props) {}
    render() {
        return(
            <Item>
                <Item.Content>
                    <Item.Header>{this.props.heading}</Item.Header>
                    <Item.Description>{this.props.description}</Item.Description>
                </Item.Content>
            </Item>
        );
    }
}

export default Element;