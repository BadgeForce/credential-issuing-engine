import React, { Component } from 'react';
import DatePicker from 'react-datepicker';

import { Loader, Icon, Feed, Header, Form, Dimmer, Grid } from 'semantic-ui-react'
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
        this.badgeforceIssuer = new bjs.Issuer('', this.handleTransactionsUpdate);
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

            const results = await this.badgeforceIssuer.issueAcademic(coreData);
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
    render() {
        return (
            <Grid style={{paddingTop: 100}} container columns={2} stackable>
                <Dimmer inverted active={this.state.loading.toggle}>
                    <Loader indeterminate>{this.state.loading.message}</Loader>
                </Dimmer>
                <Grid.Column  mobile={4} tablet={12}>
                    <Header
                        as='h1'
                        content='BadgeForce University Issuer'
                        textAlign='center'
                        subheader='Issue some credentials to whoever you want, from our fictitous BadgeForce Issuer. These credentials are issued for REAL, so DO NOT USE ANY SENSITIVE DATA'
                    />
                    <Form size='large' style={{paddingTop: 25}}>
                        <Form.Input value={this.state.recipient}  mobile={4} tablet={12} placeholder='Recipient Public Key' onChange={(e, recipient) => this.setState({recipient: recipient.value})} />
                        <Form.Input value={this.state.name}  mobile={4} tablet={12} placeholder='Credential Name' onChange={(e, name) => this.setState({name: name.value})} />
                        
                        <Form.Field style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}} mobile={4} tablet={12}>
                            Date Earned:<DatePicker selected={this.state.dateEarned} placeholderText="Date Earned" onChange={(dateEarned) => this.setState({dateEarned})} />
                            Expiration:<DatePicker selected={this.state.expiration} placeholderText="Expiration" onChange={(expiration) => this.setState({expiration})}/>
                        </Form.Field>
                        
                        <Form.Group style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Form.Button style={{display: 'flex', alignSelf: 'flex-start'}} color='blue' onClick={this.handleIssue} size='large' content='issue' icon='send' labelPosition='right'/>
                        </Form.Group>
                    </Form>
                    <Transactions transactions={this.state.transactions}/>
                </Grid.Column>
            </Grid>
        );
    }
}
