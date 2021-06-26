
var BigNumber = require('bignumber.js'); //npm install bignumber.js@2.4.0
window.BigNumber = BigNumber;

var ethUtil = require('ethereumjs-util');
ethUtil.crypto = require('crypto');
ethUtil.Tx = require('ethereumjs-tx');
ethUtil.scrypt = require('scryptsy');
ethUtil.uuid = require('uuid');
ethUtil.sha3 = require('sha3');
ethUtil.EC = require('elliptic').ec;
window.ethUtil = ethUtil;


let jsc3l = require('@com-chain.org/jsc3l');

window.blockies = jsc3l.blockies;
window.Wallet = jsc3l.Wallet;
window.uiFuncs = jsc3l.uiFuncs;
window.etherUnits = jsc3l.etherUnits;
window.ajaxReq = jsc3l.ajaxReq;
window.ethFuncs =  jsc3l.ethFuncs;
window.jsc3l_config = jsc3l.jsc3l_config;
window.jsc3l_connection =  jsc3l.jsc3l_connection;
window.jsc3l_customization =  jsc3l.jsc3l_customization;
window.jsc3l_bcRead = jsc3l.jsc3l_bcRead;
window.jsc3l_message = jsc3l.jsc3l_message;
window.jsc3l_wallet = jsc3l.jsc3l_wallet;
window.jsc3l_bcTransaction = jsc3l.jsc3l_bcTransaction;


// callback to async

window.jsc3l = {
  connection: {
    ensureComChainRepo: () => {
      return new Promise((resolve, reject) => {
        jsc3l.jsc3l_connection.ensureComChainRepo(r => {
          if (r) {
            resolve(r);
          } else {
            reject(new Error('No repository available'));
          }
        });
      });
    },
    acquireEndPoint: () => {
      return new Promise((resolve, reject) => {
        jsc3l.jsc3l_connection.acquireEndPoint(r => {
          if (r) {
            resolve(r);
          } else {
            reject(new Error('No ComChain endpoint'));
          }
        });
      });
    },
  },
  customization: {
    getConfJSON: name_currency => {
      return new Promise((resolve, reject) => {
        jsc3l.jsc3l_customization.getConfJSON(name_currency, r => {
          if (r) {
            resolve(r);
          } else {
            reject(new Error('Error while currency configuration!'));
          }
        });
      });
    },
  },
  message: {
    ensureWalletMessageKey: (wallet, message) => {
      return new Promise((resolve, reject) => {
        jsc3l.jsc3l_message().ensureWalletMessageKey(wallet, message, w => {
          resolve(w);
        });
      });
    },
    getMessageKey: (address_dest, with_private) => {
      return new Promise((resolve, reject) => {
        jsc3l.jsc3l_message().getMessageKey(address_dest, with_private, remote_key => {
          resolve(remote_key);
        });
      });
    },
  },
  ajaxReq: {
    getTransList: (id, count, offset) => {
      return new Promise((resolve, reject) => {
        jsc3l.ajaxReq.getTransList(id, count, offset, r => {
          resolve(r);
        });
      });
    },
  },
  bcRead: {
    getGlobalBalance: wallet_address => {
      return new Promise((resolve, reject) => {
        jsc3l.jsc3l_bcRead.getGlobalBalance(wallet_address, r => {
          resolve(r);
        });
      });
    },
  },
  bcTransaction: {
    TransfertNant: (wallet, to_address, amount, additional_post_data) => {
      return new Promise((resolve, reject) => {
        jsc3l.jsc3l_bcTransaction.TransfertNant(wallet, to_address, amount, additional_post_data, r => {
          if (r.isError) {
	        reject(new Error(r.error));
          } else {
            resolve(r);
          }
        });
      });
    },
  },
};


window.fetchUrl = url => {
  return new Promise((resolve, reject) => {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true);
    xobj.onreadystatechange = () => {
      if (xobj.readyState == 4 && xobj.status == "200") {
        resolve(xobj.responseText);
      }
    };
    xobj.send(null);
  });
};


window.getTransactionMemo = (wallet, transaction) => {
  let key = jsc3l.jsc3l_message().messageKeysFromCrypted(wallet, wallet.message_key.priv).clear_priv;
  let wallet_address = wallet.getAddressString().toLowerCase();

  if (transaction.addr_to.toLowerCase() == wallet_address &&
      transaction.message_to) {
    return jsc3l.jsc3l_message().decipherMessage(key, transaction.message_to);
  }

  if (transaction.addr_from.toLowerCase() == wallet_address &&
      transaction.message_from) {
    return jsc3l.jsc3l_message().decipherMessage(key, transaction.message_from);
  }

  return "";
};

