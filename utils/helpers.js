export function __hardcoded (value) {
  return value;
}

export function openInNewTab (url) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.click();
}

export function deepClone (origin) {
  return JSON.parse(JSON.stringify(origin));
}

export function __debounce (cb, delay = 500) {
  let timeoutID = null;
  return function () {
    clearTimeout(timeoutID)
    const args = arguments;
    const that = this;
    timeoutID = setTimeout(function () {
      cb.apply(that, args)
    }, delay)
  }
}

export function toFormData (payload) {
  const formData = new FormData();
  Object.keys(payload).forEach(key => {
    const value = payload[key];
    if (Array.isArray(value)) {
      value.forEach(v => {
        formData.append(`${key}[]`, v);
      })
    } else {
      formData.append(key, value);
    }
  })
  return formData;
}

export function formatPrice (value) {
  return `${new Intl.NumberFormat('ru-RU').format(Math.ceil(value))} ₸`;
}

export function deformatDate (value) {
  if (!value) {
    return value;
  }
  return value.split('.').reverse().join('-');
}
