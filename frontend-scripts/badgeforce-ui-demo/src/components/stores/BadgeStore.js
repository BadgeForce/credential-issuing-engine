import { observable } from 'mobx';
import { ProtoDecoder } from '../../badgeforcejs-lib/badgeforce_base';
import namespacing from '../../badgeforcejs-lib/namespacing';
const localforage = require('localforage');


export class BadgeStore {
    store = null;
    getDegreeCore = null;
    decoder = new ProtoDecoder();
    stateAddress = null;
    queryState = null;

    @observable cache = {};
    constructor() {
        if(location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
            localforage.clear();
        }
    }
    async setAccount(issuer) {
        try {
            const {getDegreeCore, queryState } = issuer;
            this.account = issuer.account.publicKey;
            this.getDegreeCore = getDegreeCore.bind(issuer);
            this.queryState = queryState.bind(issuer);
            this.address = namespacing.partialLeafAddress(this.account, namespacing.ACADEMIC);
            this.cache = {};
            this.store = localforage.createInstance({name: this.account});
            await this.load();
            await this.poll(); 
        } catch (error) {
            throw error;
        }
    }

    async storeBadges(keys) {
        try {
            await Promise.all(keys.map(async key => {
                return await this.storeBadge(key, await this.getDegreeCore(key));
            }));
        } catch (error) {
            throw error;
        }
    }

    async storeBadge(key, badge) {
        if(!this.decoder.isValidProto(badge)) throw new Error('Invalid protobuffer data');
        try {
            
            await this.store.setItem(key, badge);
            this.cache[key] = badge;
        } catch (error) {
            throw error;
        }
    }

    async getBadge(hash) {
        try {
            let badge = this.cache[hash];
            if(!badge) {
                badge = await this.store.getItem(hash);
                this.cache[hash] = badge;
            }
            return badge;
        } catch (error) {
            throw error;
        }
    }

    async load() {
        try {
            await this.store.iterate((value, key) => {
                this.cache[key] = value;
            });
            return this.cache;
        } catch (error) {
            throw error;
        }
        
    }

    async poll() {
        try {
            const res = await this.queryState(this.address);
            let { data } = res;
            data = data.map(i => this.decoder.decodeStorageHash(Buffer.from(i.data, 'base64')));
            const keys = data.filter(key => this.getBadge(key.hash) !== null);
            await this.storeBadges(keys.map(key => key.hash));
        } catch (error) {
            throw error;
        }
    }

    async updateAccount(account) {
        try {
            await this.setAccount(account);
            await this.poll(); 
        } catch (error) {
            throw error;
        }
    }
}
