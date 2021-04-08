import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Header, Icon, Container, List, Grid, Segment, Menu } from 'semantic-ui-react';
import "./App.css";
import Pool from "./Pool";
import Home from "./home";

if (module.hot) {
  module.hot.accept();
}

class App extends Component {
  state = {
    activeItem: 'home',
    home: true,
    pool1: false,
    pool2: false,
    pool3: false,
    pool4: false,
    pool5: false,
    pool6: false,
    pool7: false,
    pool8: false,
    pool9: false,
    pool10: false,
  }

  onHome = (event) => {
    event.preventDefault();
    this.setState({home: true, pool1: false, pool2: false, pool3: false, 
      pool4: false, pool5: false, pool6: false, pool7: false, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Home'});
  }
  onPool1 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: true, pool2: false, pool3: false, 
      pool4: false, pool5: false,pool6: false, pool7: false, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Pool-1'});
  }
  onPool2 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: true, pool3: false, 
      pool4: false, pool5: false, pool6: false, pool7: false, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Pool-2'});
  }
  onPool3 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: true, 
      pool4: false, pool5: false, pool6: false, pool7: false, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Pool-3'});
  }
  onPool4 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: false, 
      pool4: true, pool5: false, pool6: false, pool7: false, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Pool-4'});
  }
  onPool5 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: false, 
      pool4: false, pool5: true, pool6: false, pool7: false, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Pool-5'});
  }
  onPool6 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: false, 
      pool4: false, pool5: false, pool6: true, pool7: false, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Pool-6'});
  }
  onPool7 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: false, 
      pool4: false, pool5: false, pool6: false, pool7: true, 
      pool8: false, pool9: false, pool10: false, activeItem: 'Pool-7'});
  }
  onPool8 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: false, 
      pool4: false, pool5: false, pool6: false, pool7: false, 
      pool8: true, pool9: false, pool10: false, activeItem: 'Pool-8'});
  }
  onPool9 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: false, 
      pool4: false, pool5: false, pool6: false, pool7: false, 
      pool8: false, pool9: true, pool10: false, activeItem: 'Pool-9'});
  }
  onPool10 = (event) => {
    event.preventDefault();
    this.setState({home: false, pool1: false, pool2: false, pool3: false, 
      pool4: false, pool5: false, pool6: false, pool7: false, 
      pool8: false, pool9: false, pool10: true, activeItem: 'Pool-10'});
  }
  
  render() {
    const { activeItem } = this.state
    return(
      <div>
        <Header as='h1' style={{ paddingTop: "30px", paddingLeft: "25px"}}>
          <Icon name='yelp' />
          <Header.Content>
            Token Mining
            <Header.Subheader>Invest and Harvest</Header.Subheader>
          </Header.Content>
        </Header>

        <Grid>
          <Grid.Column stretched width={13} style={{ paddingLeft: "50px"}}>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.home ? "block" : "none"
            }}>
                <Home />
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool1 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 1"
                  addressOfPool = "0xF97657C5AACf53859638a376B5aa74339F34a5C9"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool2 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 2"
                  addressOfPool = "0x7e0fF8754E0B27Cf0B4192195cb6ace43a8416a0"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool3 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 3"
                  addressOfPool = "0xCB61ea3A3270Dd9801DAeB2df6888b50C4c1E321"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool4 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 4"
                  addressOfPool = "0x8ddC0b6e6e00C600f6c153e904Ae67719aE50698"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool5 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 5"
                  addressOfPool = "0x04AE55C9A393bAc1387e25739a4FdFDf5bcA46c4"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool6 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 6 "
                  addressOfPool = "0xFC218646f7429cc21C5C44f715c4951372e83770"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool7 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 7"
                  addressOfPool = "0x2CAD5a80De10dD3A313167a77618258F07525cc2"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool8 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 8"
                  addressOfPool = "0x1c1d58eb097E9d25eFc07E518740025D7BAf4cD8"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool9 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 9"
                  addressOfPool = "0x459F45F2B13B77429D64468CadDAEbC3068bBE40"
                />
              </List>
            </Segment>
            <Segment style={{ paddingTop: "5px", 
              paddingBottom: "100px", 
              paddingLeft: "10px",
              display: this.state.pool10 ? "block" : "none"
            }}>
              <List divided verticalAlign='middle'>
                <Pool 
                  poolName = "Staking Pool- 10"
                  addressOfPool = "0x6704BB7d0F606e4F7eA1b27eAc93690F272B6aac"
                />
              </List>
            </Segment>

          </Grid.Column>
          <Grid.Column width={3}>
            <Menu vertical size='massive' tabular='right' >
              <Menu.Item 
                name='Home'
                active={activeItem === 'Home'}
                onClick={this.onHome}
              />
              <Menu.Item 
                name='Pool-1'
                active={activeItem === 'Pool-1'}
                onClick={this.onPool1}
              />
              <Menu.Item
                name='Pool-2'
                active={activeItem === 'Pool-2'}
                onClick={this.onPool2}
              />
              <Menu.Item
                name='Pool-3'
                active={activeItem === 'Pool-3'}
                onClick={this.onPool3}
              />
              <Menu.Item
                name='Pool-4'
                active={activeItem === 'Pool-4'}
                onClick={this.onPool4}
              />
              <Menu.Item
                name='Pool-5'
                active={activeItem === 'Pool-5'}
                onClick={this.onPool5}
              />
              <Menu.Item
                name='Pool-6'
                active={activeItem === 'Pool-6'}
                onClick={this.onPool6}
              />
              <Menu.Item
                name='Pool-7'
                active={activeItem === 'Pool-7'}
                onClick={this.onPool7}
              />
              <Menu.Item
                name='Pool-8'
                active={activeItem === 'Pool-8'}
                onClick={this.onPool8}
              />
              <Menu.Item
                name='Pool-9'
                active={activeItem === 'Pool-9'}
                onClick={this.onPool9}
              />
              <Menu.Item
                name='Pool-10'
                active={activeItem === 'Pool-10'}
                onClick={this.onPool10}
              />
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
