import * as ls from '../utils/localStorage';
import { apiUrl } from '../utils/constants';
import { logoutUser, handleFetchResponse } from './handleFetchResponse';

// This also keeps backend active,
// so was a good idea
setInterval(() => {
    const token = ls.getToken();
    if (!token) return logoutUser();

    fetch(apiUrl + '/health/verify', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }).then(response => {
        handleFetchResponse(
            response,
            (data: any) => data
        );
    })
    
}, 300000); // Every 5 minutes