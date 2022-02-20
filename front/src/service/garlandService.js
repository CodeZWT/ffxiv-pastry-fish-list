const host = 'https://garlandtools.cn/api/get.php'
export default {
  getItem(itemId) {
    return fetch(host + `?id=${itemId}&type=item&lang=chs&version=3`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
  },
}
