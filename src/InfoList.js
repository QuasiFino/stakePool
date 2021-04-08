import React, {Component} from 'react';
import {Button, Loader, Grid, Item, GridRow, Container, Message} from 'semantic-ui-react';
import stakePool from "./stakePool";
import web3 from "./web3";
import bignumber from "bignumber.js";
import Element from "./Element";

class InfoList extends Component {
    state = {
        address: "",
        stakeToken: "",
        rewardToken: "",
        maxValue: 0,
        approved: false,
        activeItem: 'Update Cycle',
        poolStarted: false,
        checked: false,
        rewardAddress: "",
        stakeAddress: "",
        poolAddress: "",
        duration: "",
        startTime: "",
        periodFinish: "",
        cycleDuration: "",
        totalRewardSupply: "",
        rewardsClaimed: "",
        cycleReward: "",
        rewardRate: "",
        rewardPerToken: "",
        maxUint: "",
        message: "",
        loading: false,
        viewMessage: false
    }

    static async getInitialProps(props) {}

    async componentDidMount() {
        const poolStake = stakePool(this.props.addressOfPool)
        const stakeToken = await poolStake.methods.stakeToken().call();
        this.setState({stakeToken: stakeToken});

        const rewardToken = await poolStake.methods.rewardToken().call();
        this.setState({rewardToken: rewardToken});

        const poolAddress = await poolStake.methods.contractAddress().call();
        this.setState({poolAddress: poolAddress});
        
        const poolStarted = await poolStake.methods.poolEnabled().call();
        this.setState({poolStarted: poolStarted});
        

        const start = await poolStake.methods.startTime().call();
        const date = new Date(start * 1000);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        const hours = date.getHours();
        const mins = "0" + date.getMinutes();
        const secs = "0" + date.getSeconds();
        this.setState({startTime: `${day}/${month}/${year}\n${hours}:${mins.substr(-2)}:${secs.substr(-2)}`});
        
        const periodFinish = await poolStake.methods.periodFinish().call();
        const finish = new Date(periodFinish * 1000);
        const monthFinish = finish.getMonth() + 1;
        const yearFinish = finish.getFullYear();
        const dayFinish = finish.getDate();
        const hoursFinish = finish.getHours();
        const minsFinish = "0" + finish.getMinutes();
        const secsFinish = "0" + finish.getSeconds();
        this.setState({periodFinish: `${dayFinish}/${monthFinish}/${yearFinish}\n${hoursFinish}:${minsFinish.substr(-2)}:${secsFinish.substr(-2)}`});

        const cycleDuration = await poolStake.methods.duration().call();
        this.setState({cycleDuration: cycleDuration});

        const totalRewardSupply = await poolStake.methods.maxReward().call();
        this.setState({totalRewardSupply: bignumber(totalRewardSupply).dividedBy(10**18).toString()});

        const rewardsClaimed = await poolStake.methods.rewardDistributed().call();
        this.setState({rewardsClaimed: bignumber(rewardsClaimed).dividedBy(10**18).toString()});

        const cycleReward = await poolStake.methods.initReward().call();
        this.setState({cycleReward: bignumber(cycleReward).dividedBy(10**18).toString()});
        
        const rewardRate = await poolStake.methods.rewardRate().call();
        this.setState({rewardRate: bignumber(rewardRate).dividedBy(10**18).toString()});
        
        const rewardPerToken = await poolStake.methods.rewardPerToken().call();
        this.setState({rewardPerToken: bignumber(rewardPerToken).dividedBy(10**18).toString()});
    };

    onUpdate = async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            const update = await poolStake.methods.updatePeriodFinish().send({from: accounts[0]});
            this.setState({periodFinish: update});
            this.setState({viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
        } catch(err) {
            this.setState({message: err.message, viewMessage: true, loading: false})
        }
    }

    onRecover= async(event) => {
        event.preventDefault();
        const poolStake = stakePool(this.props.addressOfPool)
        const accounts = await web3.eth.getAccounts();
        this.setState({loading: true, viewMessage: false});
        try{
            await poolStake.methods.recoverERC20().send({from: accounts[0]});
            this.setState({viewMessage: true, message: "Your request was processed successfully!!!", loading: false});
        } catch(err) {
            this.setState({message: "Mining has not ended!!", viewMessage: true, loading: false})
        }
    }

    render() {
        if(!this.state.loading){
            return(
                <Grid.Column width={4} style={{ paddingTop: "20px", display: this.state.poolStarted ? "block" : "none"}}>
                    <GridRow>
                        <Button fluid onClick={this.onUpdate}>Update Cycle</Button>
                    </GridRow>
                    <GridRow style={{ paddingTop: "20px"}}>
                        <Button fluid onClick={this.onRecover}>Recover Leftover</Button>
                    </GridRow>
                    <GridRow>

                        <Item.Group divided style={{ paddingTop: "20px"}}>
                            <Element 
                                heading="Pool started at"
                                description={this.state.startTime}
                            />
                            <Element 
                                heading="Current cycle ends at"
                                description={this.state.periodFinish}
                            />
                            <Element 
                                heading="Duration per cycle in seconds"
                                description={this.state.cycleDuration}
                            />
                            <Element 
                                heading="Total Reward Supply"
                                description={this.state.totalRewardSupply}
                            />
                            <Element 
                                heading="Rewards Claimed"
                                description={this.state.rewardsClaimed}
                            />
                            <Element 
                                heading="Rewards Allocated for this cycle"
                                description={this.state.cycleReward}
                            />

                            <Element 
                                heading="Current reward rate"
                                description={this.state.rewardRate}
                            />
                            <Element 
                                heading="Current reward per token"
                                description={this.state.rewardPerToken}
                            />
                            <Element 
                                heading="Reward Token Address"
                                description={this.state.rewardToken}
                            />
                            <Element 
                                heading="Staking Token Address"
                                description={this.state.stakeToken}
                            />
                            <Element 
                                heading="Current pool Address"
                                description={this.state.poolAddress}
                            />

                        </Item.Group>
                    </GridRow>
                    <Message info style={{ display: this.state.viewMessage ? "block" : "none" }}>
                        <Message.Header>{this.state.message}</Message.Header>
                    </Message>
                </Grid.Column>
            );
        }

        return(
            <Container>
                <Loader active inline='centered' style={{ display: this.state.loading ? "block" : "none" }}>
                    Updating details....
                </Loader>
            </Container>

        );
    }
}

export default InfoList;