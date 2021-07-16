import Tx from 'ethereumjs-tx'

import ajaxReq from './ajaxReq'
import * as ethFuncs from './ethFuncs'
import * as etherUnits from './etherUnits'

const isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

export function isTxDataValid (txData) {
  if (txData.to !== '0xCONTRACT' &&
      !ethFuncs.validateEtherAddress(txData.to)) {
    throw new Error('ERROR_6')
  } else if (!isNumeric(txData.value) ||
             parseFloat(txData.value) < 0) {
    throw new Error('ERROR_8')
  } else if (!isNumeric(txData.gasLimit) ||
             parseFloat(txData.gasLimit) <= 0) {
    throw new Error('ERROR_9')
  } else if (!ethFuncs.validateHexString(txData.data)) {
    throw new Error('ERROR_10')
  }
  if (txData.to === '0xCONTRACT') txData.to = ''
}

export async function generateTx (txData) {
  try {
    isTxDataValid(txData)
    let data = await ajaxReq.getTransactionData(txData.from)

    // TODO: must test this
    if (data.error) {
      console.log(`Failed getTransactionData(${txData.from})`)
      throw new Error(data.msg)
    }
    data = data.data
    const rawTx = {
      nonce: ethFuncs.sanitizeHex(data.nonce),
      gasPrice: ethFuncs.sanitizeHex(
        ethFuncs.addTinyMoreToGas(data.gasprice)),
      gasLimit: ethFuncs.sanitizeHex(
        ethFuncs.decimalToHex(txData.gasLimit)),
      to: ethFuncs.sanitizeHex(txData.to),
      value: ethFuncs.sanitizeHex(
        ethFuncs.decimalToHex(etherUnits.toWei(txData.value, txData.unit))),
      data: ethFuncs.sanitizeHex(txData.data)
    }
    const eTx = new Tx(rawTx)

    eTx.sign(new Buffer(txData.key, 'hex'))
    rawTx.rawTx = JSON.stringify(rawTx)
    rawTx.signedTx = '0x' + eTx.serialize().toString('hex')
    rawTx.isError = false
    return rawTx
  } catch (e) {
    return {
      isError: true,
      error: e
    }
  }
}

export async function sendTx (signedTx, additionalData) {
  const data = await ajaxReq.sendRawTx(signedTx, additionalData)

  return {
    isError: !!data.error,
    error: data.error ? data.data : data.msg
  }
}
