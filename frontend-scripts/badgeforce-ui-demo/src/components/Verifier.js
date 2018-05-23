import React, { Component } from 'react';
import { Icon, List, Header, Card, Image, Form, Message, Grid, Transition } from 'semantic-ui-react'
import  bjs from '../badgeforcejs-lib'; 
import { toast } from "react-toastify";

const moment = require('moment');

export class Issuance extends Component {
    render() {
        return (
            <Card>
                <Card.Content header='Issuance' />
                <Card.Content style={{wordWrap: 'break-word'}}>
                    Signature: {this.props.data.signature}<br/>
                    Issuer: {this.props.data.issuerPublicKey}<br/>
                    Recipient: {this.props.data.recipientPublicKey}<br/>
                    Revokation Status: {this.props.data.revokationStatus}<br/>
                    Proof Of Integrity Hash: {this.props.data.proofOfIntegrityHash}<br/>
                </Card.Content>
            </Card>
        )
    }
}
export class Credential extends Component {
    constructor(props) {
        super(props);
        this.ipfsURI = `https://ipfs.io/ipfs/${this.props.ipfs}`
    }
    render() {
        return (
            <Card>
                <Image floated='right' size='mini' src='https://react.semantic-ui.com/assets/images/avatar/large/daniel.jpg' />
                <Card.Content style={{wordWrap: 'break-word'}}>
                    <Card.Header>{this.props.data.name}</Card.Header>
                    <Card.Meta>Issued On {moment.unix(this.props.data.dateEarned).toString()}</Card.Meta>
                    <Card.Description>
                        School: {this.props.data.school}<br/>
                        Institution ID: {this.props.data.institutionId}<br/>
                        Issuer: {this.props.data.issuer}<br/>
                        Recipient: {this.props.data.recipient}<br/>
                        <a target='blank' href={this.ipfsURI}>IPFS Hash {this.props.ipfs}</a>
                    </Card.Description>
                </Card.Content>
                <Card.Content style={{wordWrap: 'break-word'}} extra>
                    Expires {moment.unix(this.props.data.expiration).toString()}<br/>
                    Signature {this.props.signature}
                </Card.Content>
            </Card>
        )
    }
}

export class VerifyResults extends Component {
    render() {
        return (
            <List divided relaxed>
                {Object.keys(this.props.results).map((key, i) => {
                    return (
                        <List.Item key={i}>
                            <Icon size='large' verticalalign='middle' name={this.props.results[key].success ? 'check': 'warning circle'} color={this.props.results[key].success ? 'green': 'red'}/> 
                            <List.Content>
                                <List.Header as='h4'>{key}</List.Header>
                                <List.Description>{this.props.results[key].message}</List.Description>
                            </List.Content>
                        </List.Item>
                    )
                })}
            </List>
        )
    }
}

export class Verifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipient: '', 
            credentialName: '', 
            institutionId: '',
            error: null,
            results: null,
            toastId: null,
            loading: false,
            visible: false,
            formError: null,
            formErrors: [],
        }

        this.handleVerify = this.handleVerify.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
        this.uploadJSON = this.uploadJSON.bind(this);
        this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
        this.showResults = this.showResults.bind(this);
        this.badgeforceVerifier = new bjs.BadgeforceVerifier('', this.handleStatusUpdate);
    }

    async sleep(duration) {
        return new Promise(resolve => {
			setTimeout(() => {
			    resolve();
            }, duration*1000)
		});
    }
    async handleStatusUpdate(data) {
        try {
            await this.sleep(2);
            const {message, success} = data;
            this.props.updateToast(this.state.toastId, message, success ? toast.TYPE.SUCCESS : toast.TYPE.ERROR);
        } catch (error) {
            console.log(error);
        }    
    }
    async uploadJSON(e) {
        this.setState({loading: {toggle: true, message: 'Parsing BFAC File'}, results: null, visible: false});
        try {
            const files = document.getElementById('jsonUpload').files;
            this.badgeforceVerifier.readFile(files, async results => {
                await this.sleep(3);
                const {recipient, credentialName, institutionId} = results;
                this.setState({
                    recipient, 
                    credentialName,
                    institutionId,
                    loading: {toggle: false, message: ''},
                });
                document.getElementById('jsonUpload').value = '';
            });
        } catch (error) {
            console.log(error);
            await this.sleep(3);
            this.setState({
                recipient: '', 
                credentialName: '', 
                institutionId: '',
                results: null,
                loading: {toggle: false, message: ''},
                error
            });
        }
    }
    isValidForm() {
        const errors = [
            !this.badgeforceVerifier.isValidPublicKey(this.state.recipient) ? new Error('Invalid public key for recipient') : null,
            this.state.credentialName === '' ? new Error('Credential name is required') : null,
            this.state.institutionId === '' ? new Error('Institution ID is required') : null,
        ].filter(error => {
            return error !== null;
        });

        if(errors.length > 0) {
            this.setState({formErrors: errors, formError: true});
            return false
        }

        this.setState({formErrors: errors, formError: false});
        return true;
    }
    showFormErrors() {
        return (
            <Message error
                header='Problems with your input'
                content={<Message.List items={this.state.formErrors.map((error, i) => {
                    return <Message.Item key={i} content={error.message} />
                })} />}
            />
        )
    }
    async handleVerify() {
        if(this.isValidForm()){
            const toastId = this.props.notify('Verifying', toast.TYPE.INFO);
            this.setState({results: null, visible: false, toastId, loading: true});
            try {
                const results = await this.badgeforceVerifier.verifyAcademic(this.state.recipient, this.state.credentialName, this.state.institutionId);
                this.props.updateToast(this.state.toastId, 'Done Verifying', toast.TYPE.INFO);
                this.setState({
                    results, 
                    recipient: '', 
                    credentialName: '', 
                    institutionId: '',
                    toastId: null,
                    formError: false,
                    formErrora: [],
                    loading: false,
                    visible: true,
                });
            } catch (error) {
                this.props.updateToast(this.state.toastId, 'Uh Oh, Somethings Wrong', toast.TYPE.ERROR);
                this.setState({
                    recipient: '', 
                    credentialName: '', 
                    institutionId: '',
                    results: null,
                    toastId: null,
                    loading: false,
                    formError: false,
                    formErrora: [],
                });
            }
        }        
    }
    showResults() {
        return (
            <Grid.Row container='true' columns={2} stackable='true'>
                <Grid.Column style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Header
                        as='h1'
                        content='Credential'
                        textAlign='center'
                        subheader='Credential data is stored off chain in IPFS, Issuance is kept on chain immutable and referenced for verification'
                    />
                    <Credential 
                        data={this.state.results.degree.coreInfo} 
                        signature={this.state.results.degree.signature} 
                        ipfs={this.state.results.degree.storageHash.hash}/>
                    {/* <Issuance data={this.state.results.issuance} /> */}
                </Grid.Column>
                <Grid.Column >
                    <Header
                        as='h1'
                        content='Results'
                        textAlign='center'
                    />
                    <Transition as={Grid} animation='scale' duration={900} visible={this.state.visible}>
                        <VerifyResults results={this.state.results.results} />
                    </Transition>
                </Grid.Column>
            </Grid.Row>
        );
    }

    render() {
        return (
            <Grid style={{paddingTop: 100, height: '100vh', justifyContent: 'center'}} container columns={1} stackable>
                <Grid.Column computer='sixteen' mobile={4} tablet={12}>
                    <Header
                        as='h1'
                        content='BadgeForce Verifier'
                        textAlign='center'
                        subheader='Enter the name of the Academic Credential, the Recipients public key, and the Institution ID of the issuing institution'
                    />
                    <Form loading={this.state.loading} size='large' style={{paddingTop: 25}} error={this.state.formError ? true : undefined}>
                        <Form.Input error={this.state.formError ? true : undefined} value={this.state.recipient}  mobile={4} tablet={12} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                        <Form.Input error={this.state.formError ? true : undefined} value={this.state.credentialName}  mobile={4} tablet={12} placeholder='Credential Name' onChange={(e, credentialName) => this.setState({credentialName: credentialName.value})} />
                        <Form.Input error={this.state.formError ? true : undefined} value={this.state.institutionId}  mobile={4} tablet={12} placeholder='Institution ID' onChange={(e, institutionId) => this.setState({institutionId: institutionId.value})} />
                        <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Form.Button disabled={this.state.loading} style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.handleVerify} size='large' content='verify' icon='check' labelPosition='right'/>
                            <Form.Button disabled={this.state.loading} style={{display: 'flex', alignSelf: 'flex-start'}} color='orange' size='large' content='Verify From BFAC File Upload' icon='upload' labelPosition='right' onClick={() => document.getElementById('jsonUpload').click()} />
                        </Form.Group>
                        {this.state.formErrors.length > 0 ? this.showFormErrors() : null}
                        <input type="file" id="jsonUpload" onChange={this.uploadJSON} style={{display: 'none'}} />  
                    </Form>
                </Grid.Column>
                {this.state.results ? this.showResults() : null}
            </Grid>
        );
    }
}
