import axios, { AxiosError } from 'axios'

export class UserUtils {

    private GET_USER_BY_DISCORD = "/user/getByDiscord";
    private API_KEY_DEFINITION = "apikey";
    private API_URL;
    private API_KEY;

    constructor(apiurl : string, apikey : string) {
        this.API_URL = apiurl;
        this.API_KEY = apikey;
    }

    public async checkIfUserIsRegistered(userId : string) : Promise<boolean> {
        var response = await axios.get(`${this.API_URL}${this.GET_USER_BY_DISCORD}/${userId}${this.API_KEY ? `?${this.API_KEY_DEFINITION}=${this.API_KEY}` : ''}`);
        if(response.data.length > 0) {
            if(response.data.data) {
                if(response.data.data.walletAddress) {
                    console.log(response.data.data.walletAddress);
                    if(response.data.data.walletAddress.length > 0) {
                        return true;
                    }
                }
            }
        }
        console.log(response.data);
        return false;
    }
  }