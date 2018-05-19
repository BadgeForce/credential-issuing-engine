import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Loader, Icon, Feed, Header, Form, Dimmer, Grid, Sidebar, Menu, Button } from 'semantic-ui-react'
import  bjs from '../badgeforcejs-lib'; 

import 'react-datepicker/dist/react-datepicker.css';
const moment = require('moment');
class Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            data: this.props.data
        }
    }
    render() {
        return (
            <Feed.Event>
                <Feed.Label>
                    <Icon name='circle' />
                </Feed.Label>
                <Feed.Content>
                    <Feed.Summary>
                        <Feed.Event>{this.state.data.metaData.description}</Feed.Event>
                        <Feed.Date>{this.state.data.metaData.date}</Feed.Date>
                    </Feed.Summary>
                    <Feed.Meta>
                        <Feed.Label>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                                <Icon name='hourglass half' />
                                {`Status: ${this.state.data.status}`}  
                                {this.state.data.status === 'PENDING' ? <Loader style={{paddingLeft: 10}} active size='mini' inline/> : null}
                            </div>
                        </Feed.Label>
                    </Feed.Meta>
                </Feed.Content>
            </Feed.Event>
        )
    }
}

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: this.props.transactions
        }
        console.log(this.props.transactions);
    }
    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                <Feed>
                    {Object.keys(this.props.transactions).map((val, i) => {
                        return (
                            <Transaction data={this.props.transactions[val]} id={i} key={val}/>
                        );
                    })}
                </Feed>
            </div>
        )
    }
}

class RevokeForm extends Component {
    state = {recipient: '', credentialName: '', institutionId: ''};
    handleRevoke = async() => {
        try {
            await this.props.handle(this.state)
            this.setState({recipient: '', credentialName: '', institutionId: ''});
        } catch (error) {
            console.log(error);
            this.setState({recipient: '', credentialName: '', institutionId: ''});
        }
    }
    render(){
        return (
            <Form size='large' style={{paddingTop: 25}}>
                <Form.Input value={this.state.recipient}  mobile={4} tablet={12} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                <Form.Input value={this.state.credentialName}  mobile={4} tablet={12} placeholder='Credential Name' onChange={(e, credentialName) => this.setState({credentialName: credentialName.value})} />
                <Form.Input value={this.state.institutionId}  mobile={4} tablet={12} placeholder='Institution ID' onChange={(e, institutionId) => this.setState({institutionId: institutionId.value})} />
                <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='red' onClick={this.handleRevoke} size='large' content='Revoke' icon='ban' labelPosition='right'/>
                </Form.Group>
            </Form>
        )
    }
}

class NewAccountForm extends Component {
    state = {password: ''};
    createAccount = async () => {
        try {
            await this.props.handleCreateAccount(this.state.password);
            this.setState({password: ''});
        } catch (error) {
            console.log(error);
            this.setState({password: ''});
        }
    }
    importAccount = async (e) => {
        try {
            await this.props.handleImportAccount(e, this.state.password);
            this.setState({password: ''});
        } catch (error) {
            console.log(error);
            this.setState({password: ''});
        }
    }
    render(){
        return (
            <Form size='large' style={{paddingTop: 25}}>
                <Form.Input type='password' placeholder='very strong password' value={this.state.password}  mobile={4} tablet={12} onChange={(e, password) => this.setState({password: password.value})} />
                <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.createAccount} size='large' content='Create Account' icon='key' labelPosition='right'/>
                    <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='orange' onClick={() => document.getElementById('accountUpload').click()} size='large' content='Upload Account File' icon='upload' labelPosition='right'/>
                </Form.Group>
                <input type="file" id="accountUpload" onChange={this.importAccount} style={{display: 'none'}} />  
            </Form>
        )
    }
}
export class Issuer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipient: '', 
            dateEarned: null,
            name: '',
            expiration: null,
            results: null,
            loading: {toggle: false, message: ''},
            visible: false,
            transactions: {}
        }

        this.demoCred = {
            school: 'BadgeForce University',
            issuer: '0x0',
            institutionId: '123456',
        }

        this.handleIssue = this.handleIssue.bind(this);
        this.handleTransactionsUpdate = this.handleTransactionsUpdate.bind(this);
        this.importAccount = this.importAccount.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.downloadKeyPair = this.downloadKeyPair.bind(this);
        this.badgeforceIssuer = new bjs.Issuer('', this.handleTransactionsUpdate);
    }

    createAccount(password) {
        try {
            this.badgeforceIssuer.newAccount(password);
            this.downloadKeyPair();
        } catch (error) {
            console.log(error);
        }
    }
    downloadKeyPair() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.badgeforceIssuer.account.downloadStr);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", `badgeforce-key${moment().toString()}.json`);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
    async importAccount(e, password) {
        this.setState({loading: {toggle: true, message: 'Importing Account'}, results: null, visible: false});
        try {
            const files = document.getElementById('accountUpload').files;
            this.badgeforceIssuer.importAccount(files, password, async results => {
                await this.sleep(3);
                console.log(results);
                this.setState({
                    loading: {toggle: false, message: ''},
                });
                document.getElementById('accountUpload').value = '';
            });
        } catch (error) {
            console.log(error);
            await this.sleep(3);
            this.setState({
                loading: {toggle: false, message: ''},
                // error
            });
        }
    }

    async sleep(duration) {
        return new Promise(resolve => {
			setTimeout(() => {
			    resolve();
            }, duration*1000)
		});
    }

    handleTransactionsUpdate(id, transaction) {
        console.log(id, transaction)
        this.setState(prevState => ({
            transactions: {
                ...prevState.transactions, id: transaction
            }
        }));
    }

    async handleIssue() {
        this.setState({loading: {toggle: true, message: 'loading'}, results: null, visible: false});
        try {
            const coreData = {
                ...this.demoCred,
                recipient: this.state.recipient,
                dateEarned: this.state.dateEarned.unix().toString(),
                expiration: this.state.expiration.unix().toString(),
                name: this.state.name
            }

            const results = await this.badgeforceIssuer.IssueAcademic(coreData, console.log);
            this.setState({
                results, 
                recipient: '', 
                dateEarned: null,
                name: '',
                expiration: null,
                loading: {toggle: false, message: ''},
                visible: true
            });
        } catch (error) {
            await this.sleep(4);
            this.setState({
                recipient: '', 
                dateEarned: null,
                name: '',
                expiration: null,
                results: null,
                loading: {toggle: false, message: ''},
                error
            });
        }
    }

    async handleRevoke(data) {
        this.setState({loading: {toggle: true, message: 'loading'}, results: null, visible: false});
        try {
            await this.badgeforceIssuer.revoke(data);
            this.setState({loading: {toggle: false, message: ''}, results: null, visible: false});
        } catch (error) {
            console.log(error);
            this.setState({loading: {toggle: false, message: ''}, results: null, visible: false});
        }
    }

    showIssueForm() {
        return (
            <Form size='large' style={{paddingTop: 25}}>
                <Form.Input value={this.state.recipient}  mobile={4} tablet={12} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                <Form.Input value={this.state.name}  mobile={4} tablet={12} placeholder='Credential Name' onChange={(e, name) => this.setState({name: name.value})} />
                
                <Form.Field style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}} mobile={4} tablet={12}>
                    Date Earned:<DatePicker selected={this.state.dateEarned} placeholderText="Date Earned" onChange={(dateEarned) => this.setState({dateEarned})} />
                    Expiration:<DatePicker selected={this.state.expiration} placeholderText="Expiration" onChange={(expiration) => this.setState({expiration})}/>
                </Form.Field>
                <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.handleIssue} size='large' content='Issue Credential' icon='send' labelPosition='right'/>
                </Form.Group>
            </Form>
        );
    }

    render() {
        return (
            <div>
                <div style={{paddingTop: 10}}>
                    <Button floated='left' onClick={this.props.toggleSideMenu}>Menu</Button>
                </div>
                <Grid style={{paddingTop: 10, height: '100vh', justifyContent: 'center'}} container columns={2} stackable>
                    <Dimmer inverted active={this.state.loading.toggle}>
                        <Loader indeterminate>{this.state.loading.message}</Loader>
                    </Dimmer>
                    
                    <Grid.Column  mobile={4} tablet={12}>
                        <Header as='h1' textAlign='center'>   
                            <Header.Content>
                                BadgeForce University Issuer
                            </Header.Content>
                            <Header.Subheader content='Issue some credentials to whoever you want, from our fictitous BadgeForce Issuer. These credentials are issued for REAL, so DO NOT USE ANY SENSITIVE DATA'/>
                        </Header>
                        {this.props.active === 'issue' ? this.showIssueForm() : null}
                        {this.props.active === 'revoke' ? <RevokeForm handle={console.log} /> : null}
                        {this.props.active === 'account' ? <NewAccountForm handleCreateAccount={this.createAccount} handleImportAccount={this.importAccount} /> : null}
                        <Transactions transactions={this.state.transactions}/>
                    </Grid.Column>
                </Grid>
            </div>

        );
    }
}

export class IssuerSideOptionsOverlay extends Component {
    state = { visible: false, active: 'issue' }
    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        const { visible } = this.state
        return (
            <div>
                <Sidebar.Pushable as={Grid}>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        width='thin'
                        direction='right'
                        visible={visible}
                        icon='labeled'
                        vertical
                        inverted
                    >
                    <Menu.Item name='issue' onClick={() => this.setState({active: 'issue'})}>
                        <Icon name='send' />
                        Issue Credential
                    </Menu.Item>
                    <Menu.Item name='revoke' onClick={() => this.setState({active: 'revoke'})}>
                        <Icon name='ban' />
                        Revoke Credential
                    </Menu.Item>
                    <Menu.Item name='account' onClick={() => this.setState({active: 'account'})}>
                        <Icon name='key' />
                        Create New Account
                    </Menu.Item>
                </Sidebar>
                <Sidebar.Pusher>
                    <Issuer active={this.state.active} toggleSideMenu={this.toggleVisibility}/> : null}
                </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}