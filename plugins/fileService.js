import Vue from 'vue';

export default (context, inject) => {
  class FileService {
    download (path) {
      if (!path) {
        return context.$toast.error('Некорректный путь к файлу!')
      }
      const link = document.createElement('a');
      link.href = path;
      link.click();
    }
  }

  Vue.prototype.$file = new FileService();
  inject('file', new FileService());
}
