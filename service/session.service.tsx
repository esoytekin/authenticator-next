import axios from 'axios';

const SERVICE_URL = '/api/endsession';
const SessionService = {
    endSession() {
        return axios.post(SERVICE_URL);
    },
};

export default SessionService;
