import {default as bjs} from '../badgeforcejs-lib';
const localforage = require('localforage');
const {BadgeForceBase} = require('./badgeforce_base');
class BadgeStore extends BadgeForceBase {
    store = localforage.createInstance({name: "badges"});
    constructor(account) {
        super();
        this.account = account;
    }
    getKey(name) {
        return btoa(name);
    }

    async storeBadge(badge) {
        if(!this.isValidProto(badge)) throw new Error('Invalid protobuffer data');
        try {
            await this.store.setItem(this.getKey(badge.name), badge);
        } catch (error) {
            throw error;
        }
    }

    async getBadge(name) {
        return await this.store.getItem(this.getKey(name));
    }

    async getAllBadges() {
        const badges = [];
        await this.store.iterate(value => {
            badges.push(value);
        })
        return badges;
    }

    async poll() {
        try {
            const address = bjs.namespacing.partialLeafAddress(this.account, bjs.namespacing.ACADEMIC);
            const { data } = await this.queryState(address);
            data.map(async info => {
                try {
                    const storageHash = this.decodeStorageHash(Buffer.from(info.data, 'base64'));
                    const core = await this.getDegreeCore(storageHash.hash);
                    await this.storeBadge(core);
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

export class Store {
    constructor(account) {
        this.badgeStore = new BadgeStore(account);    
    }
}
