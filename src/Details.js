import React, {Component} from 'react';
import {Reveal, Image, Container} from 'semantic-ui-react';
import stakePool from "./stakePool";
import web3 from "./web3";
import bignumber from "../node_modules/bignumber.js/bignumber.js";

class Details extends Component {
    state = {
        tokensDeposited: "",
        tokensEarned: ""
    }
    static async getInitialProps(props) {}
    async componentDidMount() {
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        const tokensDeposited = await poolStake.methods
            .balanceOf(accounts[0]).call();
        this.setState({tokensDeposited: bignumber(tokensDeposited).dividedBy(10**18).toString()});

        const tokensEarned = await poolStake.methods
            .earned(accounts[0]).call();
        this.setState({tokensEarned: bignumber(tokensEarned).dividedBy(10**18).toString()});
    };
    static async getInitialProps(props) {};

    render() {
        return(
            <Container style={{paddingTop: "50px"}}>
            
                <h2>Hoover to check your earnings</h2>
                <Reveal animated='move' instant>
                <Reveal.Content visible>
                <Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_XHgzvYgzXZlmmKbcxuRlPGRyJP3OoMD0q9FmNrmikHQFta77bTuuGf1rQdfBAnGqUTU&usqp=CAU' 
                    size='medium' />
                </Reveal.Content>
                <Reveal.Content hidden>
                    <h4>Tokens Deposited</h4>
                    {this.state.tokensDeposited}
                    <h4>Reward to claim</h4>
                    {this.state.tokensEarned}
                </Reveal.Content>
            </Reveal>
          
          </Container>
        );
    }
}

export default Details;