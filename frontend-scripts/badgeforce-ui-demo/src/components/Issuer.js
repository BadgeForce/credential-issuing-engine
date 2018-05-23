import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Loader, Icon, Feed, Header, Form, Dimmer, Grid, Confirm, Input, Tab, Message} from 'semantic-ui-react'
import  bjs from '../badgeforcejs-lib'; 
import { toast } from "react-toastify";

import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

const moment = require('moment');

const base = new bjs.BadgeForceBase();
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
                    <Icon name='circle' color={this.state.data.status !== 'COMMITTED' ? 'orange': 'green'}/>
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
    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                <Feed>
                    {this.props.transactions.map((watcher, i) => {
                        return (
                            <Transaction data={watcher.transaction} id={watcher.id} key={i}/>
                        );
                    })}
                </Feed>
            </div>
        )
    }
}

class RevokeForm extends Component {
    constructor(props){
        super(props);
        this.state = {recipient: '', credentialName: '', institutionId: '', formErrors: [], formError: false};
        this.showFormErrors = this.showFormErrors.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
    }
    handleRevoke = async() => {
        if(this.isValidForm()){
            try {
                await this.props.handle(this.state)
                this.setState({recipient: '', credentialName: '', institutionId: '', formErrors: [], formError: false});
            } catch (error) {
                console.log(error);
                this.setState({recipient: '', credentialName: '', institutionId: '', formErrors: [], formError: false});
            }       
        }
    }
    isValidForm() {
        const errors = [
            !base.isValidPublicKey(this.state.recipient) ? new Error('Invalid public key for recipient') : null,
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
    render(){
        return (
            <Form size='large' style={{paddingTop: 25}} error={this.state.formError ? true : undefined}>
                <Form.Input error={this.state.formError ? true : undefined} value={this.state.recipient}  mobile={4} tablet={12} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                <Form.Input error={this.state.formError ? true : undefined} value={this.state.credentialName}  mobile={4} tablet={12} placeholder='Credential Name' onChange={(e, credentialName) => this.setState({credentialName: credentialName.value})} />
                <Form.Input error={this.state.formError ? true : undefined} value={this.state.institutionId}  mobile={4} tablet={12} placeholder='Institution ID' onChange={(e, institutionId) => this.setState({institutionId: institutionId.value})} />
                <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='red' onClick={this.handleRevoke} size='large' content='Revoke' icon='ban' labelPosition='right'/>
                </Form.Group>
                {this.state.formErrors.length > 0 ? this.showFormErrors() : null}
            </Form>
        )
    }
}

class NewAccountForm extends Component {
    state = {password: '', name: '', formErrors: [], formError: false};
    createAccount = async () => {
        if(this.isValidForm()) {
            try {
                await this.props.handleCreateAccount(this.state.password, this.state.name);
                this.setState({password: '', name: '', formErrors: [], formError: false});
            } catch (error) {
                console.log(error);
                this.setState({password: '', name: '', formErrors: [], formError: false});
            }
        }
    }
    isValidForm = () => {
        const errors = [
            this.state.password === '' ? new Error('Password cannot be empty') : null
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
    showFormErrors = () => {
        return (
            <Message error
                header='Problems with your input'
                content={<Message.List items={this.state.formErrors.map((error, i) => {
                    return <Message.Item key={i} content={error.message} />
                })} />}
            />
        )
    }
    importAccount = async (e) => {
        try {
            await this.props.handleImportAccount(e, this.state.password);
            this.setState({password: '', name: '', formErrors: [], formError: false});
        } catch (error) {
            console.log(error);
            this.setState({password: '', name: '', formErrors: [], formError: false});
        }
    }
    render(){
        return (
            <Form size='large' style={{paddingTop: 25}} error={this.state.formError ? true : undefined}>
                <Form.Input error={this.state.formError ? true : undefined} type='password' placeholder='very strong password' value={this.state.password}  mobile={4} tablet={12} onChange={(e, password) => this.setState({password: password.value})} />
                <Form.Input placeholder='Name for account' value={this.state.name}  mobile={4} tablet={12} onChange={(e, name) => this.setState({name: name.value})} />
                <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.createAccount} size='large' content='Create Account' icon='key' labelPosition='right'/>
                    <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='orange' onClick={() => document.getElementById('accountUpload').click()} size='large' content='Upload Account File' icon='upload' labelPosition='right'/>
                </Form.Group>
                {this.state.formErrors.length > 0 ? this.showFormErrors() : null}
                <input type="file" id="accountUpload" onChange={this.importAccount} style={{display: 'none'}} />  
            </Form>
        )
    }
}

class IssueForm extends Component {
    constructor(props){
        super(props);
        this.state = {recipient: '', dateEarned: null, name: '', expiration: null, formErrors: [], formError: false};
        console.log(this.props.warn);
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showNoAccountWarning = this.showNoAccountWarning.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
    }
    handleIssue = async () => {
        if(this.isValidForm()) {
            try {
                await this.props.handle(this.state);
                this.setState({recipient: '', dateEarned: null, name: '', expiration: null, formErrors: [], formError: false});
            } catch (error) {
                console.log(error);
                this.setState({recipient: '', dateEarned: null, name: '', expiration: null, formErrors: [], formError: false});
            }
        }
    }
    isValidForm() {
        const errors = [
            !base.isValidPublicKey(this.state.recipient) ? new Error('Invalid public key for recipient') : null,
            this.state.name === '' ? new Error('Credential name is required') : null,
            this.state.dateEarned === null ? new Error('Date earned is required') : null,
            this.state.expiration && moment().isAfter(this.state.expiration) ? new Error('Cannot issue an expired credential') : null
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

    showNoAccountWarning() {
        return (
            <Message 
                header='No account detected'
                content='Could not detect an account, please import or create one using the Create Account tab'
            />
        )
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
    render(){
        return (
            <Form size='large' style={{paddingTop: 25}} error={this.state.formError ? true : undefined}>
                <Form.Input error={this.state.formError ? true : undefined} value={this.state.recipient}  mobile={4} tablet={12} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                <Form.Input error={this.state.formError ? true : undefined} value={this.state.name}  mobile={4} tablet={12} placeholder='Credential Name' onChange={(e, name) => this.setState({name: name.value})} />
                <Form.Group widths='equal'>
                    <Form.Field error={this.state.formError ? true : undefined} style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                        <h4 style={{marginRight: 10}}>Date Earned:</h4>              
                        <DatePicker selected={this.state.dateEarned} placeholderText="Date Earned" onChange={(dateEarned) => this.setState({dateEarned})} />
                    </Form.Field>
                    <Form.Field error={this.state.formError ? true : undefined} style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
                        <h4 style={{marginRight: 10}}>Expiration:</h4>
                        <DatePicker selected={this.state.expiration} placeholderText="Expiration" onChange={(expiration) => this.setState({expiration})} />
                    </Form.Field>
                </Form.Group>
                <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Form.Button disabled={this.props.warn} style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.handleIssue} size='large' content='Issue Credential' icon='send' labelPosition='right'/>
                </Form.Group>
                {this.state.formErrors.length > 0 ? this.showFormErrors() : null}
                {this.props.warn ? this.showNoAccountWarning() : null}
            </Form>
        )
    }
}

class PasswordConfirm extends Component {
    state = {password: ''};
    confirmInput = (onchange) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 50}}>
              <Input type='password' onChange={onchange} placeholder='re-enter password' />
            </div>
        );
    }
    render() {
        return (
            <Confirm
              header='Invalid Password For Account'
              content={this.confirmInput((e, password) => {
                this.setState({password})
              })}
              onCancel={this.props.cancel}
              onConfirm={() => this.props.finish(this.state.password)}
              open={this.props.open}
              confirmButton='Try Again'
          />
        );
    }
}
export class Issuer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: null,
            loading: {toggle: false, message: ''},
            visible: false,
            confirmPassword: false,
            error: null,
            transactions: [],
            toastId: null
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
        this.panes = [
            { menuItem: 'Issue', render: () => <Tab.Pane>{<IssueForm warn={this.badgeforceIssuer.account === null} handle={this.handleIssue} />}</Tab.Pane> },
            { menuItem: 'Revoke', render: () => <Tab.Pane>{<RevokeForm handle={console.log} />}</Tab.Pane> },
            { menuItem: 'Create Account', render: () => <Tab.Pane>{<NewAccountForm handleCreateAccount={this.createAccount} handleImportAccount={this.importAccount} />}</Tab.Pane> }
        ]

       
    }
    createAccount(password, name) {
        try {
            this.badgeforceIssuer.newAccount(password);
            this.downloadKeyPair(name);
            this.props.notify('Account Created', toast.TYPE.SUCCESS);
        } catch (error) {
            console.log(error);
            this.props.notify('Something Went Wrong!', toast.TYPE.ERROR);
        }
    }
    downloadKeyPair(name) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.badgeforceIssuer.account.downloadStr);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", `badgeforce-keys${name ? name: moment().toISOString()}.json`);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
    async importAccount(e, password) {
        this.setState({results: null, visible: false, loading: true});
        try {
            const files = document.getElementById('accountUpload').files;
            const finishCB = async (results, error) => {
                const update = {loading: {toggle: false, message: ''}};
                if(error) {
                    if(error.message === this.badgeforceIssuer.accountErrors.invalidPassword) {
                        update['confirmPassword'] = true;
                    } else {
                        this.props.updateToast(this.state.toastId, 'Something went wrong', toast.TYPE.ERROR);
                    }
                }
                this.props.notify('Account Imported', toast.TYPE.SUCCESS);
                this.setState(update);
                document.getElementById('accountUpload').value = '';
            }
            this.badgeforceIssuer.importAccount(files, password, finishCB);
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

    handleTransactionsUpdate(transaction) {
        const transactions = this.state.transactions.map(tx => {
            return tx.id === transaction.id ? transaction : tx;
        })
        this.setState({transactions});
    }

    async handleIssue(data) {
        this.setState({results: null, visible: false, loading: true});
        try {
            const {recipient, dateEarned, name, expiration} = data;
            const coreData = {
                ...this.demoCred,
                recipient,
                dateEarned: dateEarned.unix().toString(),
                expiration: expiration.unix().toString(),
                name
            }

            const watcher = await this.badgeforceIssuer.issueAcademic(coreData);
            console.log(watcher);
            this.setState(prevState => ({
                loading: {toggle: false, message: ''},
                visible: true,
                toastId: null,
                transactions: [...prevState.transactions, watcher]
            }));
        } catch (error) {
            this.props.notify('Something Went Wrong While Issuing!', toast.TYPE.ERROR);
            this.setState({
                results: null,
                loading: {toggle: false, message: ''},
                error,
                toastId: null
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

    render() {
        return (
            <Grid style={{paddingTop: 100, height: '100vh', justifyContent: 'center'}} computer='sixteen' mobile={4} tablet={12} container columns={1} stackable>
                <PasswordConfirm finish={(password) => {
                        this.setState({confirmPassword: false});
                        try {
                            this.badgeforceIssuer.decryptAccount(password);
                        } catch (error) {
                            if(error.message === this.badgeforceIssuer.accountErrors.invalidPassword) {
                                this.props.updateToast(this.state.toastId, 'Password still invalid, try importing again', toast.TYPE.ERROR);
                            } else {
                                this.props.updateToast(this.state.toastId, 'Something went wrong', toast.TYPE.ERROR);
                            }
                        }
                    }}
                    open={this.state.confirmPassword} 
                    cancel={() => this.setState({confirmPassword: false})}
                />
                <Grid.Column computer='sixteen' mobile={4} tablet={12}>
                    <Header as='h1' textAlign='center'>   
                        <Header.Content>
                            BadgeForce University Issuer
                        </Header.Content>
                        <Header.Subheader content='Issue some credentials to whoever you want, from our fictitous BadgeForce Issuer. These credentials are issued for REAL, so DO NOT USE ANY SENSITIVE DATA'/>
                    </Header>
                    <Tab menu={{ fluid: true, vertical: true}} menuPosition='left' panes={this.panes} />
                    <Transactions transactions={this.state.transactions}/>
                </Grid.Column>
            </Grid>
        );
    }
}
