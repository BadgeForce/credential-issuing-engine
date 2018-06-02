import React, { Component } from 'react';
import { List, Header, Image, Grid, Dimmer, Loader, Button } from 'semantic-ui-react'
import { Credential } from './Verifier';
import { ProtoDecoder } from '../badgeforcejs-lib/badgeforce_base' 
import { toast } from "react-toastify";
import {observer, inject} from 'mobx-react';
const QRCode = require('qrcode.react');

const moment = require('moment');
const decoder = new ProtoDecoder();
@inject('accountStore')
@observer
export class CompactInfoList extends Component{
    accountStore = this.props.accountStore;
    
    handleClick = (badge, key) => {
        this.props.setActive(badge, key);
    }
    getList = () => {
        return Object.keys(this.accountStore.badgeStore.cache).map((key, i) => {
            const badge = this.accountStore.badgeStore.cache[key];
            return (
                <List.Item onClick={() => this.handleClick(badge, key)} key={i}>
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
                {Object.keys(this.accountStore.badgeStore.cache).length > 0 ? this.getList() : null}
            </List>
        );
    }
}

@inject('accountStore')
@observer
export class Badges extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: null,
            key: null,
            loading: true
        }
        this.downloadQRC = this.downloadQRC.bind(this);
        this.qrc = React.createRef();
        this.accountStore = this.props.accountStore;
    }

    renderBadges() {
        return (
            <Grid.Row>
                <Grid.Column width={4} >
                    <CompactInfoList setActive={(active, key) => this.setState({active, key})} />
                </Grid.Column> 
                <Grid.Column style={{height: '100vh'}} computer={12} mobile={4} tablet={12}>
                    {this.state.active ? this.renderActive() : null}
                </Grid.Column>  
            </Grid.Row>
        );
    }
    downloadQRC() {
        const link = document.createElement("a");
        link.href = document.getElementById('qrcode').toDataURL();
        link.download = `badgeforce-credential-${this.state.active.coreInfo.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    renderActive() {
        const qrCodeVal = JSON.stringify({data: decoder.encodedQRStorageHash(this.state.key)});
        console.log(qrCodeVal);
        return(
            <div>
                <Credential full={true} data={this.state.active.coreInfo} signature={this.state.active.signature} ipfs={this.state.key}/>
                <QRCode id='qrcode' size={160} style={{height: 'auto', width: 'auto'}} value={qrCodeVal} />
                <Button style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.downloadQRC} size='large' content='download qr code' icon='download' labelPosition='right'/>
            </div>
        );
    }
    noBadges() {
        return(
            <Grid.Row>
                <Grid.Column computer={12} mobile={4} tablet={12}>
                    <Header style={{display: 'flex', alignItems: 'center'}} as='h1' content='No Badges Found For This Account' textAlign='center' /> 
                </Grid.Column> 
            </Grid.Row>
        );
    }
    render() {
        return (
            <Grid.Column>
                {/* <Dimmer active={this.state.loading}>
                    <Loader indeterminate>Fetching Badges </Loader>
                </Dimmer> */}
                <Grid columns={2} centered container stackable>
                     {Object.keys(this.accountStore.badgeStore.cache).length > 0 ? this.renderBadges() : this.noBadges()}
                </Grid>
            </Grid.Column>
        )
    }
}