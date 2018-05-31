import { observable } from 'mobx';
import { BadgeStore } from './BadgeStore';
import { Issuer } from '../../badgeforcejs-lib/issuer';

export class AccountStore { 
  @observable badgeStore = new BadgeStore();
  @observable accounts;
  @observable current; 

  constructor() {
   this.accounts = [];
   this.current = null
  }

  async switchAccount(publicKey) {
    try {
      this.current = this.findAccount(publicKey);
      await this.badgeStore.setAccount(this.current);
    } catch (error) {
      throw error; 
    }
  }

  async newAccount(issuer) {
    try {
        this.current = issuer;
        console.log('YOOOOO', this.current.account.publicKey)
        await this.badgeStore.setAccount(this.current);
        
        if(!this.findAccount(issuer.account.publicKey)) {
          this.accounts.push(issuer);
        }

      return this.current;
    } catch (error) {
      throw new Error(error);
    }
  }

  findAccount(publicKey) {
    return this.accounts.find(issuer => issuer.account.publicKey === publicKey);
  }
}

export const accountStore = new AccountStore();