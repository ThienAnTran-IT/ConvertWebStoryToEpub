const axios = require('axios');

const sendRequest = () => {
  axios
  .get('https://ztruyen.vn/truyen/nghich-thien-than-phi-toi-thuong-39863/9451288')
  .then(res => {
    console.log(`statusCode: ${res.status}`);
    console.log(res);
    if (res.status === 200 && res.data) {
      htmlRaw = res.data
      console.log("----- htmlRaw: ", htmlRaw)
      console.log(typeof htmlRaw)
      var doc = new DOMParser().parseFromString(htmlRaw, "text/xml");
      console.log("---------doc: ", doc)
    }
  })
  .catch(error => {
    console.error(error);
  });
}

module.exports = { sendRequest }