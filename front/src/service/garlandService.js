const host = 'https://garlandtools.cn/api/get.php'
export default {
  async getItem(itemId) {
    if (!itemId) {
      return undefined
    }

    return fetch(host + `?id=${itemId}&type=item&lang=chs&version=3`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
  },
}

export const toMultiLangDescription = ret => {
  return {
    name_chs: ret?.item?.description ?? '',
    name_en: ret?.item?.en?.description ?? '',
    name_ja: ret?.item?.ja?.description ?? '',
  }
}
