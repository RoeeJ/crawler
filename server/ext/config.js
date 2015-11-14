var fs = require('fs');
Config = {
  //BASE_PATH: '/Users/cipher/Developer/Meteor/'
  BASE_PATH: fs.existsSync('/ext') ? '/ext/' : '/home/cipher/Development/Meteor/',
  NITRO_PASSWORDS: ['NB4HRBZ5JVFD'],
  proxies: [],
  users: {
    sdarot:'username=oshers1994&password=32154987&login_remember=1&submit_login=התחבר'
  }
};
