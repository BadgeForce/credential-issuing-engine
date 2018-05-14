import React, { Component } from 'react';
import { Loader, Icon, Header, Form, Feed, Grid, Tab, Transition, Confirm } from 'semantic-ui-react'
import  verifierjs from '../verifierjs'; 

export class Verifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipient: '', 
            credentialName: '', 
            institutionID: ''
        }

        this.badgeforceVerifier = new verifierjs.BadgeforceVerifier('');

        this.handleVerify = this.handleVerify.bind(this);
    }

    async handleVerify() {
        try {
            await this.badgeforceVerifier.verifyAcademic(this.state.recipient, this.state.credentialName, this.state.institutionID);
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <Form size='large' style={{padding: 100}}>
                    <Form.Input value={this.state.recipient} width={6} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                    <Form.Input value={this.state.credentialName} width={6} placeholder='Credential Name' onChange={(e, credentialName) => this.setState({credentialName: credentialName.value})} />
                    <Form.Input value={this.state.institutionID} width={3} placeholder='Institution ID' onChange={(e, institutionID) => this.setState({institutionID: institutionID.value})} />
                    <Form.Button onClick={this.handleVerify} size='large' content='verify' icon='send' labelPosition='right'/>
            </Form>
        );
    }
}
