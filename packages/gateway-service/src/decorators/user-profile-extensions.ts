import {UserProfile} from '@loopback/security';
import {RoleEnum} from '../enums/role.enum';

export interface MyUserProfile extends UserProfile {
  role: RoleEnum;
  [attribute: string]: any;
}