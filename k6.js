import http from 'k6/http'
import { sleep } from 'k6'
import * as crypto from 'k6/crypto'

const uuidv4 = () => crypto.md5(crypto.randomBytes(42), 'hex')

export const options = {
  vus: 10,
  duration: '30s',
}



export default function () {
  const url = 'http://127.0.0.1:3000/transactions'
  const payload = JSON.stringify({
    "accountExternalIdDebit": uuidv4(),
    "accountExternalIdCredit": uuidv4(),
    "tranferTypeId": 6,
    "value": 1
  })

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  http.post(url, payload, params)
  http.get(url)

  sleep(1)
}