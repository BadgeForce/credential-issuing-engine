import * as prefixes from './namespace_prefixes';
import { Verifier } from './verifier';
import { Issuer } from './issuer';
import  {BatchStatusWatcher, MetaData, Watcher, Batch, } from './batch_status_watcher';
import {BadgeForceBase} from './badgeforce_base';

export default {
    prefixes, 
    BadgeforceVerifier: Verifier,
    Issuer,
    BatchStatusWatcher, MetaData, Watcher, Batch,
    BadgeForceBase
}