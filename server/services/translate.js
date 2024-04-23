import axios from "axios";

class TranslateService {
  #encodedParams;
  #options;

  constructor() {
    this.#encodedParams = new URLSearchParams();
    this.#options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '28c9d6ec66mshe67a087efc0ec59p1ebffcjsn2e918567d82b',
        'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
      },
      data: this.#encodedParams,
    };
  }

  async translateText(text, to) {
    this.#encodedParams.set("from", "he");
    this.#encodedParams.set("to", to);
    this.#encodedParams.set("text", text);
    try {
      const response = await axios.request(this.#options);
      return response.data.trans;
    } catch (error) {
      console.error(error);
    }
  }
}

export default TranslateService;
