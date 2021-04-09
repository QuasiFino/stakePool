import React, {Component} from 'react';
import validator from 'validator';
import {Button, Loader, List, Form, Segment, Grid, Divider, Item, Container, GridRow, Message} from 'semantic-ui-react';
import stakePool from "./stakePool";
import web3 from "./web3";
import IErc20 from "./IErc20";
import bignumber from "bignumber.js";
import Details from "./Details"
import InfoList from "./InfoList";

class Pool extends Component{
    state = {
        amountEnter: "",
        address: "",
        stakeToken: "",
        rewardToken: "",
        maxValue: 0,
        approved: false,
        poolStarted: false,
        checked: false,
        rewardAddress: "",
        stakeAddress: "",
        poolAddress: "",
        duration: "",
        maxUint: "",
        message: "",
        loading: false,
        viewMessage: false

    };
    toggle = () => this.setState((prevState) => ({ checked: !prevState.checked }));

    static async getInitialProps(props) {}

    async componentDidMount() {
        const poolStake = stakePool(this.props.addressOfPool)
        const stakeToken = await poolStake.methods.stakeToken().call();
        this.setState({stakeToken: stakeToken});
        
        const poolStarted = await poolStake.methods.poolEnabled().call();
        this.setState({poolStarted: poolStarted});
        
        const maxUint = await poolStake.methods.maxUint().call();
        this.setState({maxUint: maxUint});

        const poolAddress = await poolStake.methods.contractAddress().call();
        this.setState({poolAddress: poolAddress});

        const accounts = await web3.eth.getAccounts();
        const token = IErc20(this.state.stakeToken);
        const approved = await token.methods
            .allowance(accounts[0], this.state.poolAddress).call();

        if(approved > 0){
            this.setState({approved: true});
        }
    };

    onStake = async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            await poolStake.methods
                .stake(`${this.state.amountEnter}000000000000000000`)
                .send({from: accounts[0]}); 
            this.setState({amountEnter: "", viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
        } catch(err) {
            this.setState({message: err.message, viewMessage: true, loading: false, amountEnter: "" })
        }
    };
    
    onWithdraw = async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            await poolStake.methods
                .withdraw(`${this.state.amountEnter}000000000000000000`)
                .send({from: accounts[0]}); 
            this.setState({amountEnter: "", viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
        } catch(err) {
            this.setState({message: err.message, viewMessage: true, loading: false, amountEnter: "" })
        } 
    };

    onGetReward = async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            await poolStake.methods
                .getReward()
                .send({from: accounts[0]}); 
            this.setState({amountEnter: "", viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
        } catch(err) {
            this.setState({message: err.message, viewMessage: true, loading: false, amountEnter: "" })
        } 
    };

    onExit = async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            await poolStake.methods
                .exit()
                .send({from: accounts[0]}); 
                this.setState({amountEnter: "", viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
            } catch(err) {
                this.setState({message: err.message, viewMessage: true, loading: false, amountEnter: "" })
            } 
    };

    onApprove = async(event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const token = IErc20(this.state.stakeToken);
        this.setState({loading: true, viewMessage: false});
        try{
            await token.methods
                .approve(this.props.addressOfPool, this.state.maxUint)
                .send({from: accounts[0]});
            this.setState({approved: true});
            this.setState({viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
        } catch(err) {
            this.setState({message: err.message, viewMessage: true, loading: false})
        }
    };

    onInitiate = async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            await poolStake.methods
                .initialize(this.state.rewardAddress,
                    this.state.stakeAddress,
                    this.state.checked,
                    this.state.duration
                ).send({from: accounts[0]});
                this.setState({viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
            } catch(err) {
                this.setState({message: err.message, viewMessage: true, loading: false})
            }
    };

    onStart = async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            await poolStake.methods.startPool().send({from: accounts[0]});
            this.setState({poolStarted: true});
            this.setState({viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
        } catch(err) {
            this.setState({message: err.message, viewMessage: true, loading: false})
        }
    }

    render() {
        return(

            <List.Item style={{ paddingTop: "10px"}}>
                <List.Content style={{ paddingTop: "20px"}}>
                    <Container >
                        <Grid >
                        <InfoList 
                            addressOfPool = {this.props.addressOfPool}
                        />
                            <Grid.Column width={12} style={{paddingLeft: "100px"}} verticalAlign="top">
                                <Container style={{display: this.state.poolStarted ? "none" : "block",
                                        paddingLeft: "20px", paddingRight: "20px"
                                    }}
                                >
                                    <Segment inverted>
                                        Before initiating ensure the rewards are send to the pool 
                                        <h4>{this.props.addressOfPool}</h4>
                                          
                                        
                                        <Form inverted>
                                            <Form.Group widths='equal'>
                                                <Form.Input fluid label='Reward Token Address' placeholder='address' 
                                                    value={this.state.rewardAddress}
                                                    onChange={(event) => {this.setState({
                                                        rewardAddress: event.target.value,
                                                        viewMessage: false
                                                        });
                                                    }}
                                                />
                                                <Form.Input fluid label='Stake Token Address' placeholder='address' 
                                                    value={this.state.stakeAddress}
                                                    onChange={(event) => {this.setState({
                                                        stakeAddress: event.target.value,
                                                        viewMessage: false
                                                        });
                                                    }}
                                                />
                                            </Form.Group>
                                            <Form.Input fluid label='Duration per cycle in seconds' placeholder='Seconds' 
                                                value={this.state.duration}
                                                onChange={(event) => {this.setState({
                                                    duration: event.target.value,
                                                    viewMessage: false
                                                    });
                                                }}
                                            />
                                            <Form.Group widths='equal'>
                                                
                                                <Form.Checkbox label='Is it a uniswap pair?'
                                                    checked={this.state.checked}
                                                    onChange={this.toggle}
                                                />
                                                
                                            </Form.Group>
                                        <Grid columns="equal">
                                            <Grid.Column>
                                                <Button fluid primary type='submit' onClick={this.onInitiate}>Initiate Pool</Button>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Button fluid primary type='submit'onClick={this.onStart}>Start Pool</Button>
                                            </Grid.Column>

                                            
                                        </Grid>
                                    </Form>
                                    </Segment>
                                </Container>
                                <Container style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px",
                                    display: this.state.approved ? "none" : "block"}}
                                >
                                    <Message 
                                        warning
                                        header="You've gotta approve to be able to stake !!"
                                        content="Approve inorder to provide allowance for staking"
                                    />
                                    <Button fluid primary onClick={this.onApprove}>Approve</Button>
                                </Container>
                                <Container style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "20px", 
                                    display: this.state.approved ? "block" : "none"}}
                                >
                                    <Grid>
                                        <Grid.Column width={"10"}>
                                            <h2>{this.props.poolName}</h2>
                                        </Grid.Column>
                                        <Grid.Column width={"6"} align="right">
                                            Mining has began!!
                                        </Grid.Column>
                                    </Grid>
                                    <Segment inverted >
                                        <Form inverted>
                                            <Form.Input fluid placeholder='Amount' 
                                                type="text" pattern="[0-9]*"
                                                value={this.state.amountEnter} 
                                                onChange={(event) => {
                                                    let amount = event.target.value < 0 
                                                        ? (event.target.value = 0)
                                                        : event.target.value;
                                                    let amt = validator.isInt(amount)
                                                        ? amount
                                                        : "";
                                                    this.setState({amountEnter: amt, viewMessage: false});
                                                }}                        
                                            />
                                            <Grid columns="equal">
                                                <Grid.Column>
                                                    <Button fluid primary type='submit' onClick={this.onStake}>Stake</Button>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Button fluid primary type='submit' onClick={this.onWithdraw}>Withdraw</Button>
                                                </Grid.Column>
                                            </Grid>
                                        </Form>
                                    </Segment>
                                </Container>
                                <Container style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "10px", display: this.state.approved ? "block" : "none"}}>
                                    <Grid columns='equal'>
                                        <Grid.Column>
                                            <GridRow stretched>
                                                <Button fluid onClick={this.onGetReward}>
                                                    Get Rewards
                                                </Button>
                                            </GridRow>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <GridRow stretched>
                                                <Button fluid onClick={this.onExit}>
                                                    Withdraw and Exit
                                                </Button>
                                            </GridRow>
                                        </Grid.Column>
                                    </Grid>
                                    <Container style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "10px", display: this.state.poolStarted ? "block" : "none"}}>
                                        <Container style={{ display: this.state.loading ? "none" : "block" }}>
                                            <Details 
                                                addressOfPool = {this.props.addressOfPool}
                                            />
                                        </Container>
                                    </Container>

                                </Container>
                                <Loader active inline='centered' size='large' style={{ display: this.state.loading ? "block" : "none" }}>
                                    Your request is being processed....
                                </Loader>
                                <Message info style={{ display: this.state.viewMessage ? "block" : "none" }}>
                                    <Message.Header>{this.state.message}</Message.Header>
                                </Message>
                            </Grid.Column>
                        </Grid>
                    </Container>
                </List.Content>
            </List.Item>
            
        );
    }
};

export default Pool;

// style={{ display: this.state.view ? "block" : "none" }}
// componentWillUnmount() {
//     clearInterval(this.refreshTimer);
//   }
