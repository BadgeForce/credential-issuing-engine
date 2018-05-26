import React, { Component } from 'react';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Verifier } from './Verifier';
import { Issuer } from './Issuer';
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
    }

    notify(message, type) {
        const id = toast(message, { autoClose: 15000, type, position: toast.POSITION.TOP_RIGHT });
        return id;
    }

    updateToast(id, message, type) {
        toast.update(id, {render: message, type, autoClose: 15000});
    }

    render() {
      return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <ToastContainer autoClose={15000} />
            <Sidebar.Pushable as={'div'}>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    width='thin'
                    direction='top'
                    visible={true}
                    icon='labeled'
                    inverted
                >   
                     <Menu.Item  header>
                        <Icon name='key' />
                        {this.state.account ? `Active Account: ${this.state.account}` : 'No Account Detected'}
                    </Menu.Item >

                    <Menu.Item position='right' name='verifier' onClick={() => this.setState({active: 'verifier'})}>
                        <Icon name='checkmark' />
                        Verifier
                    </Menu.Item>
                    <Menu.Item name='issuer' onClick={() => this.setState({active: 'issuer'})}>
                        <Icon name='university' />
                        Issuer
                    </Menu.Item>
    
                </Sidebar>
                <Sidebar.Pusher>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', overflowY: 'scroll'}}>
                        {this.state.active === 'verifier' ? <Verifier updateToast={this.updateToast} notify={this.notify} /> : <Issuer updateAccount={(account => this.setState({account}))} updateToast={this.updateToast} notify={this.notify} />}
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
      )
    }
}
