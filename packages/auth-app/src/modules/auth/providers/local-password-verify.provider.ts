import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';

import { AuthUser } from '../models/auth-user.model';
import { Tenant } from '../../../models';
import {UserRepository} from '../../../repositories';

export class LocalPasswordVerifyProvider implements Provider<VerifyFunction.LocalPasswordFn> {
    constructor(
        @repository(UserRepository) 
        public userrepository: UserRepository,
    ) {}

    value(): VerifyFunction.LocalPasswordFn {
        return async (username: string, password: string) => {
            const user: AuthUser = new AuthUser (
                await this.userrepository.verifyPassword(username, password),
            );
            user.permissions = [];
            user.tenant = new Tenant({id: user.defaultTenant});
            return user;
        };
    }
}