import React, { Component } from 'react';
import { Step, Loader, Icon, List, Header, Card, Image, Form, Dimmer, Grid, Transition } from 'semantic-ui-react'
import  verifierjs from '../verifierjs'; 

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
                <Image src='https://react.semantic-ui.com/assets/images/avatar/large/daniel.jpg' />
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

// export class VerifySteps extends Component {

// }


export class Verifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipient: '', 
            credentialName: '', 
            institutionId: '',
            error: null,
            results: null,
            loading: {toggle: false, message: ''},
            verifying: {
                toggle: false, 
                steps: {}
            },
            visible: false
        }

        
        this.handleVerify = this.handleVerify.bind(this);
        this.uploadJSON = this.uploadJSON.bind(this);
        this.handleSteps = this.handleSteps.bind(this);
        this.badgeforceVerifier = new verifierjs.BadgeforceVerifier('', this.handleSteps);
    }

    async sleep(duration) {
        return new Promise(resolve => {
			setTimeout(() => {
			    resolve();
            }, duration*1000)
		});
    }
    async handleSteps(active, failed, move) {
        console.log(this.state.verifying.steps);
        try {
            await this.sleep(1);
            const {steps} = this.state.verifying;
            if(failed) {
                steps[active].disabled = true;
                steps[active].completed = false;
            }
            
            if(move) {
                steps[active-1].active = false;
                steps[active-1].completed = true;
            } 
            
            steps[active].active = true;

            this.setState(prevState => ({
                verifying: {
                    ...prevState.verifying, steps: steps
                }
            }));
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
    async handleVerify() {
        this.setState({verifying: {toggle: true, steps: this.badgeforceVerifier.newSteps()}, results: null, visible: false});
        try {
            const results = await this.badgeforceVerifier.verifyAcademic(this.state.recipient, this.state.credentialName, this.state.institutionId);
            this.setState({
                results, 
                recipient: '', 
                credentialName: '', 
                institutionId: '',
                error: null,
                verifying: {toggle: false, steps: {}},
                visible: true
            });
        } catch (error) {
            await this.sleep(4);
            this.setState({
                recipient: '', 
                credentialName: '', 
                institutionId: '',
                results: null,
                verifying: {toggle: false, steps: {}},
                error
            });
        }
    }
    render() {
        return (
            <Grid style={{paddingTop: 100}} container columns={2} stackable>
                <Dimmer inverted active={this.state.loading.toggle}>
                    <Loader indeterminate>{this.state.loading.message}</Loader>
                </Dimmer>
                <Dimmer inverted active={this.state.verifying.toggle}>
                    {Object.values(this.state.verifying.steps).length > 0 ? 
                        <Step.Group size='mini'>
                            {Object.values(this.state.verifying.steps).map((step, i) => {
                                return (
                                    <Step key={i} disabled={step.disabled} completed={step.completed} active={step.active}>
                                        <Icon name='info' />
                                        <Step.Content>
                                            <Step.Title>{step.title}</Step.Title>
                                            <Step.Description>{step.description}</Step.Description>
                                        </Step.Content>
                                    </Step>
                                );
                            })}
                        </Step.Group> : <Loader indeterminate />}
                </Dimmer>
                <Grid.Column  mobile={4} tablet={12}>
                    <Header
                        as='h1'
                        content='BadgeForce Verifier'
                        textAlign='center'
                        subheader='Enter the name of the Academic Credential, the Recipients public key, and the Institution ID of the issuing institution'
                    />
                    <Form size='large' style={{paddingTop: 25}}>
                        <Form.Input value={this.state.recipient}  mobile={4} tablet={12} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                        <Form.Input value={this.state.credentialName}  mobile={4} tablet={12} placeholder='Credential Name' onChange={(e, credentialName) => this.setState({credentialName: credentialName.value})} />
                        <Form.Input value={this.state.institutionId}  mobile={4} tablet={12} placeholder='Institution ID' onChange={(e, institutionId) => this.setState({institutionId: institutionId.value})} />
                        <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.handleVerify} size='large' content='verify' icon='check' labelPosition='right'/>
                            <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='orange' size='large' content='Verify From BFAC File Upload' icon='upload' labelPosition='right' onClick={() => document.getElementById('jsonUpload').click()} />
                        </Form.Group>
                        <input type="file" id="jsonUpload" onChange={this.uploadJSON} style={{display: 'none'}} />  
                    </Form>
                </Grid.Column>
                {this.state.results ? 
                    <Grid.Column divided='true'  mobile={4} tablet={12}>
                        <Grid container columns={2} divided stackable>
                            <Grid.Column style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Header
                                    as='h1'
                                    content='Credential & Issuance'
                                    textAlign='center'
                                    subheader='Credential data is stored off chain in IPFS, Issuance is kept on chain immutable and referenced for verification'
                                />
                                <Transition as={Grid} animation='scale' duration={900} visible={this.state.visible}>
                                    <Credential 
                                        data={this.state.results.degree.coreInfo} 
                                        signature={this.state.results.degree.signature} 
                                        ipfs={this.state.results.degree.storageHash.hash}/>
                                </Transition>
                                <Transition as={Grid} animation='scale' duration={900} visible={this.state.visible}>
                                    <Issuance data={this.state.results.issuance} />
                                </Transition>
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
                        </Grid>
                    </Grid.Column>: null}
            </Grid>
        );
    }
}
