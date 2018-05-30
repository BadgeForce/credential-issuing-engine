import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Icon, List, Header, Card, Image, Form, Message, Grid, Dimmer, Loader } from 'semantic-ui-react'
import  bjs from '../badgeforcejs-lib';
import { Credential } from './Verifier'; 
import { toast } from "react-toastify";
import { Store } from '../badgeforcejs-lib/ui-store';

const moment = require('moment');

export class CompactInfoList extends Component{
    handleClick = (name) => {
        this.props.setActive(name);
    }
    getList = () => {
        return this.props.badges.map((badge, i) => {
            return (
                <List.Item onClick={() => this.handleClick(badge)} key={i}>
                    <Image avatar src={badge.coreInfo.image} />
                    <List.Content>
                        <List.Header as='a'>{badge.coreInfo.name}</List.Header>
                        <List.Description>Date Earned: {moment.unix(badge.coreInfo.dateEarned).toString()}</List.Description>
                    </List.Content>
                </List.Item>
            );
        });
    }
    render() {
        return(
            <List>
                {this.props.badges.length > 0 ? this.getList() : null}
            </List>
        );
    }
}

export class Badges extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: null,
            badges: [],
            loading: true
        }

        console.log(this.props.account);
        this.badgeStore = new Store(this.props.account).badgeStore;
    }

    async componentWillMount() {
        try {
            await this.badgeStore.poll();
            const badges = await this.badgeStore.getAllBadges();
            console.log(badges);
            this.setState({badges: [...this.state.badges, ...badges], loading: false, active: badges[0]});
        } catch (error) {
            console.log(error);
        }
    }
    renderBadges() {
        return (
            <Grid.Row>
                <Grid.Column width={4} >
                    <CompactInfoList setActive={(active) => this.setState({active})} badges={this.state.badges} />
                </Grid.Column> 
                <Grid.Column style={{height: '100vh'}} computer={12} mobile={4} tablet={12}>
                    {this.state.active ? <Credential
                        full={true}
                        data={this.state.active.coreInfo} 
                        signature={this.state.active.signature} 
                        ipfs={'this.state.active.storageHash.hash'}
                    />: null}
                </Grid.Column>  
            </Grid.Row>
        );
    }
    noBadges() {
        return(
            <Grid.Row>
                <Dimmer active={this.state.loading}>
                    <Loader indeterminate>Fetching Badges </Loader>
                </Dimmer>
                <Grid.Column computer={12} mobile={4} tablet={12}>
                    <Header style={{display: 'flex', alignItems: 'center'}} as='h1' content='No Badges Found For This Account' textAlign='center' /> 
                </Grid.Column> 
            </Grid.Row>
        );
    }
    render() {
        return (
            <Grid.Column>
                <Grid columns={2} centered container stackable>
                     {this.state.badges.length > 0 ? this.renderBadges() : this.noBadges()}
                </Grid>
            </Grid.Column>
        )
    }
}