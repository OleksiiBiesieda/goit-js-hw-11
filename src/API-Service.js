import axios from "axios";

export default class ApiService {
    constructor() {
        this.URL = 'https://pixabay.com/api/';
        this.PIXABAY_KEY = '30568782-28bd13ed320ba8406bed27cec';
        this.page = 1;
        this.perPage = 40;
        this.imageType = 'photo';
        this.orientation = 'horizontal';
        this.safesearch = "true";
        this.searchQuery = '';
    }
    async fetchPictures() {
       try {const response = await axios(`${this.URL}?key=${this.PIXABAY_KEY}&q=${this.searchQuery}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${this.page}&per_page=${this.perPage}`);
           return response.data;
        }
        catch {}
    } 
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
}