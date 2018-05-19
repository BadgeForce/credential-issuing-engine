import React, { Component } from 'react';
import { Tab} from 'semantic-ui-react';
import { Verifier } from './Verifier';
import { IssuerSideOptionsOverlay } from './Issuer';

export class Home extends Component {  
    constructor(props) {
        super(props);
        this.panes = [
            { menuItem: 'Verifier', render: () => <Tab.Pane>{<Verifier />}</Tab.Pane> },
            { menuItem: 'Issuer', render: () => <Tab.Pane>{<IssuerSideOptionsOverlay />}</Tab.Pane> },
        ]   
    }
    render() {
      return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={this.panes} />
        </div>
      )
    }
}
