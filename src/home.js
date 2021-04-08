import React, {Component} from 'react';
import validator from 'validator';
import {Image, Container, GridRow, Message} from 'semantic-ui-react';

class Home extends Component {
    render() {
        return(
            <Container>
                <Image src='https://bitcoinchaser.com/wp-content/uploads/2018/07/bitcoin-mining-for-dummies_800x480-compressor.jpg' fluid />
                <h2>Mine your Tokens !!!</h2>
            </Container>
        );
    }
}

export default Home;