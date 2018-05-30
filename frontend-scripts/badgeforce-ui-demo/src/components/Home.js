import React, { Component } from 'react';
import { Grid, Menu, Icon, Header } from 'semantic-ui-react';
import { Verifier } from './Verifier';
import { Issuer } from './Issuer';
import { Badges } from './Badges';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export class Home extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            active: 'verifier',
            account: ''
        }
        this.notify = this.notify.bind(this);
        this.updateToast = this.updateToast.bind(this);

        this.headers = {
            verifier: {
                content: 'Verifier',
                subheader: 'Enter the name of the Academic Credential, the Recipients public key, and the Institution ID of the issuing institution'
            },
            issuer: {
                content: 'BadgeForce University Issuer',
                subheader: 'Issue some credentials to whoever you want, from our fictitous BadgeForce Issuer. These credentials are issued for REAL, so DO NOT USE ANY SENSITIVE DATA'
            },
            badges: {
                content: 'Badges',
                subheader: 'Current badges for this account'
            }     
        }
    }

    notify(message, type) {
        const id = toast(message, { autoClose: 15000, type, position: toast.POSITION.TOP_RIGHT });
        return id;
    }

    updateToast(id, message, type) {
        toast.update(id, {render: message, type, autoClose: 15000});
    }

    renderContent() {
        let component;
        switch (this.state.active) {
            case 'issuer':
                component = <Issuer updateAccount={(account => this.setState({account}))} updateToast={this.updateToast} notify={this.notify} />;
                break;
            
            case 'badges': 
                component = <Badges account={this.state.account || ''} updateToast={this.updateToast} notify={this.notify} />
                break;
            default:
                component = <Verifier updateToast={this.updateToast} notify={this.notify} />
                break;
        }

        return component;
    }

    getSubHeader(active) {
        return this.subheaders[this.state.active]
    }

    render() {
      return (
        <Grid style={{paddingTop: 40}} columns={2} centered container stackable>
            <Header as='h1' content={this.headers[this.state.active].content} textAlign='center' subheader={this.headers[this.state.active].subheader} />
            <Grid.Row>
                <ToastContainer autoClose={5000} />
                <Grid.Column width={4} >
                    <Menu vertical size='huge' fluid>
                        <Menu.Item icon='key' header name={this.state.account ? `Active Account: ${this.state.account}` : 'No Account Detected'} />
                        <Menu.Item>
                            <Icon name='student' />
                            <Menu.Menu>
                                <Menu.Item header name='badges' onClick={() => this.setState({active: 'badges'})} />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item icon='checkmark' header name='verifier' onClick={() => this.setState({active: 'verifier'})} />
                        <Menu.Item icon='university' header name='issuer' onClick={() => this.setState({active: 'issuer'})} />
                    </Menu>
                </Grid.Column> 
                <Grid.Column style={{height: '100vh'}} computer={12} mobile={4} tablet={12}>
                    {this.renderContent()}
                </Grid.Column>  
            </Grid.Row> 
        </Grid>
      )
    }
}
