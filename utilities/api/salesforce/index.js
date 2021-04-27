import { login } from './login';
import { logout } from './logout';
import { queries } from './queries';
import * as fetchers from './fetchers';
import * as custom from './custom';
import * as crud from './crud';

const user = {
    login,
    logout,
};

export default { user, fetchers, queries, custom, crud };
