export class PageVisibilityUtil {
  pageIsHidden

  constructor() {
    let hidden, visibilityChange
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }

    if (typeof document.addEventListener === 'undefined' || hidden === undefined) {
      console.log(
        'This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
      )
    } else {
      // Handle page visibility change
      document.addEventListener(
        visibilityChange,
        () => (this.pageIsHidden = document[hidden]),
        false
      )
    }
  }
}
