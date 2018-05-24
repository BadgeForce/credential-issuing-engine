import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Loader, Icon, Feed, Header, Form, Grid, Confirm, Input, Tab, Message} from 'semantic-ui-react'
import  bjs from '../badgeforcejs-lib'; 
import { toast } from "react-toastify";
import { Credential } from './Verifier';
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

        this.statusColors = {
            COMMITTED: {color: 'green', icon: 'check circle'},
            INVALID: {color: 'red', icon: 'warning circle'}, 
            PENDING: {color: 'orange', icon: 'wait'}
        }
    }
    render() {
        return (
            <Feed.Event>
                <Feed.Label>
                    <Icon name={this.statusColors[this.state.data.status].icon} color={this.statusColors[this.state.data.status].color}/>
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
                                {`Transaction Status: ${this.state.data.status}`}  
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
        this.state = {recipient: '', credentialName: '', institutionId: this.props.demoCred.institutionId, formErrors: [], formError: false};
        this.showFormErrors = this.showFormErrors.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
    }
    handleRevoke = async() => {
        if(this.isValidForm()){
            try {
                await this.props.handle(this.state)
                this.setState({recipient: '', credentialName: '', formErrors: [], formError: false});
            } catch (error) {
                console.log(error);
                this.setState({recipient: '', credentialName: '', formErrors: [], formError: false});
            }       
        }
    }
    isValidForm() {
        const errors = [
            !base.isValidPublicKey(this.state.recipient) ? new Error('Invalid public key for recipient') : null,
            this.state.credentialName === '' ? new Error('Credential name is required') : null
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
                <Form.Input value={this.state.institutionId} disabled mobile={4} tablet={12} placeholder='Institution ID provided for all credentials issued using demo BadgeForce University Issuer' onChange={(e, institutionId) => this.setState({institutionId: institutionId.value})} />
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
        this.setState({formErrors: []})
        let formErrors = this.state.formErrors;
        return [
            this.state.password === '' ? new Error('Password cannot be empty') : null
        ].filter(error => error !== null)
        .map(error => {
            if(error) this.setState({formErrors: [...formErrors, error], formError: true});
            return error;
        }).length === 0;
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
        this.state = {recipient: '', dateEarned: null, name: '', image: null, expiration: null, formErrors: [], formError: false, loading: false};
        this.showFormErrors = this.showFormErrors.bind(this);
        this.showNoAccountWarning = this.showNoAccountWarning.bind(this);
        this.isValidForm = this.isValidForm.bind(this);
    }
    uploadImage = (e) => {
        this.setState({loading: true});
        try {
            const files = document.getElementById('credentialImageUpload').files;
            this.props.readImageFile(files, results => {
                console.log(results);
                this.setState({loading: false, image: results});
                this.props.notify('Image uploaded', toast.TYPE.SUCCESS);
                document.getElementById('credentialImageUpload').value = '';
            });
        } catch (error) {
            console.log(error);
            this.props.notify('Could not upload image, try again or issue without it', toast.TYPE.ERROR);
        }
    }
    handleIssue = async () => {
        if(this.isValidForm()) {
            console.log(this.state);
            await this.props.handle(this.state);
            this.setState({recipient: '', dateEarned: null, name: '', expiration: null, image: null, formErrors: [], formError: false});
        }
    }

    getPreview = () => {
        return <Credential full={false} data={{...this.props.demo, issuer: this.props.issuer, ...this.state}} />
    }

    isValidForm() {
        this.setState({formErrors: []})
        let formErrors = [];
        return [
            !base.isValidPublicKey(this.state.recipient) ? new Error('Invalid public key for recipient') : null,
            this.state.name === '' ? new Error('Credential name is required') : null,
            this.state.dateEarned === null ? new Error('Date earned is required') : null,
            this.state.expiration && moment().isAfter(this.state.expiration) ? new Error('Cannot issue an expired credential') : null
        ].filter(error => error !== null)
        .map(error => {
            if(error) this.setState({formErrors: [...formErrors, error], formError: true});
            return error;
        }).length === 0;
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
            <Form loading={this.state.loading} size='large' style={{paddingTop: 25}} error={this.state.formError ? true : undefined}>
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
                    <Form.Button disabled={this.props.warn || this.state.loading} style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.handleIssue} size='large' content='Issue Credential' icon='send' labelPosition='right'/>
                    <Form.Button disabled={this.props.warn || this.state.loading} style={{display: 'flex', alignSelf: 'flex-start'}} color='orange' size='large' content='Upload Image' icon='upload' labelPosition='right' onClick={() => document.getElementById('credentialImageUpload').click()} />
                </Form.Group>
                <input type="file" id='credentialImageUpload' onChange={this.uploadImage} style={{display: 'none'}} />  
                {this.state.formErrors.length > 0 ? this.showFormErrors() : null}
                {this.props.warn ? this.showNoAccountWarning() : this.getPreview()}
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
            confirmPassword: {show: false, account: null, loading: false},
            error: null,
            transactions: [],
            toastId: null
        }

        

        this.handleIssue = this.handleIssue.bind(this);
        this.handleRevoke = this.handleRevoke.bind(this);
        this.handleTransactionsUpdate = this.handleTransactionsUpdate.bind(this);
        this.importAccount = this.importAccount.bind(this);
        this.importAccountDone = this.importAccountDone.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.downloadKeyPair = this.downloadKeyPair.bind(this);
        this.badgeforceIssuer = new bjs.Issuer('', this.handleTransactionsUpdate);
        this.demoCred = {
            school: 'BadgeForce University',
            institutionId: '123456'
        }
        this.panes = [
            { menuItem: 'Issue', render: () => <Tab.Pane>{<IssueForm issuer={this.badgeforceIssuer.account ? this.badgeforceIssuer.account.publicKey: null} notify={this.props.notify} demo={this.demoCred} readImageFile={this.badgeforceIssuer.readImageFile} warn={this.badgeforceIssuer.account === null} handle={this.handleIssue} />}</Tab.Pane> },
            { menuItem: 'Revoke', render: () => <Tab.Pane>{<RevokeForm demoCred={this.demoCred} handle={this.handleRevoke} />}</Tab.Pane> },
            { menuItem: 'Create Account', render: () => <Tab.Pane>{<NewAccountForm handleCreateAccount={this.createAccount} handleImportAccount={this.importAccount} />}</Tab.Pane> }
        ]

       
    }
    createAccount(password, name) {
        try {
            this.badgeforceIssuer.newAccount(password);
            this.downloadKeyPair(name);
            this.props.notify('Account Created', toast.TYPE.SUCCESS);
            this.props.updateAccount(this.badgeforceIssuer.account.publicKey);
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
    async importAccountDone (account, error) {
        document.getElementById('accountUpload').value = '';
        let stateUpdate = {loading: {toggle: false, message: ''}};
        const handleErr = (error) => {
            if(error) {
                let invalidPassword = this.badgeforceIssuer.accountErrors.invalidPassword;
                const notifyMsg = (error && error.message === invalidPassword) ? 'Account password invalid, try re-enter password' : 'Something went wrong, try again'
                this.props.notify(notifyMsg, toast.TYPE.ERROR);
                this.setState({...stateUpdate, confirmPassword: {show: true, account}});
            }
            return error;
        }
        
        if(!handleErr(error)) {
            this.props.notify('Account Imported', toast.TYPE.SUCCESS);
            this.props.updateAccount(this.badgeforceIssuer.account.publicKey);
            this.setState(stateUpdate);
        }   
    }
    async importAccount(e, password) {
        this.setState({results: null, visible: false, loading: true});
        try {
            const files = document.getElementById('accountUpload').files;
            this.badgeforceIssuer.importAccount(files, password, this.importAccountDone);
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
        console.log(data);
        this.setState({results: null, visible: false, loading: true});
        try {
            const {recipient, dateEarned, name, expiration, image} = data;
            const coreData = {
                ...this.demoCred,
                recipient,
                dateEarned: dateEarned.unix().toString(),
                expiration: expiration.unix().toString(),
                issuer: this.badgeforceIssuer.account.publicKey,
                name,
                image
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
        this.setState({results: null, visible: false, loading: true});
        try {
            const watcher = await this.badgeforceIssuer.revoke(data);
            this.setState(prevState => ({
                loading: {toggle: false, message: ''},
                visible: true,
                toastId: null,
                transactions: [...prevState.transactions, watcher]
            }));
        } catch (error) {
            console.log(error);
            this.props.notify('Something Went Wrong While Revoking!', toast.TYPE.ERROR);
            this.setState({results: null, visible: false, loading: false});
        }
    }
    
    render() {
        return (
            <Grid style={{paddingTop: 100, height: '100vh', justifyContent: 'center'}} computer='sixteen' mobile={4} tablet={12} container columns={1} stackable>
                <PasswordConfirm loading={this.state.confirmPassword.loading} finish={(password) => {
                        this.setState({confirmPassword: {loading: false}});
                        try {
                            this.badgeforceIssuer.decryptAccount(password, this.state.confirmPassword.account);
                            this.setState({confirmPassword: {show: false, account: null, loading: false}});
                        } catch (error) {
                            this.setState({confirmPassword: {show: false, account: null, loading: false}});
                            if(error.message === this.badgeforceIssuer.accountErrors.invalidPassword) {
                                this.props.notify('Account Password still Invalid, try re-uploading', toast.TYPE.ERROR);
                            } else {
                                this.props.notify('Something went wrong', toast.TYPE.ERROR);
                            }
                        }
                    }}
                    open={this.state.confirmPassword.show} 
                    cancel={() => this.setState({confirmPassword: {show: false, account: null, loading: false}})
                }
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
