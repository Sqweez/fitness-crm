export default {
  data: () => ({
    isClientVideoEnabled: false,
    isWebcamInitiated: false,
    image: null,
  }),
  methods: {
    _capturePhoto () {
      const canvas = this.$refs.canvas;
      const video = this.$refs.webcam;
      if (canvas && video) {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
          const photoPreview = window.URL.createObjectURL(file);
          this.$emit('webcam:photo', {photoPreview, file});
        }, 'image/jpeg', 1);
      }
      return null;
    },
    async initWebcam () {
      try {
        const video = this.$refs.webcam;
        const vendorUrl = window.URL || window.webkitURL;
        if (!navigator.mediaDevices.getUserMedia) {
          return false;
        }
        if (video) {
          video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
          this.isClientVideoEnabled = true;
          this.isWebcamInitiated = true;
        }
      } catch (e) {
        console.log('Webcam is not available!');
      }
    },
    stopWebcam () {
      if (!this.isWebcamInitiated) {
        return false;
      }
      const video = this.$refs.webcam;
      if (!video) {
        return;
      }
      const stream = video.srcObject;
      const tracks = stream.getTracks();

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        track.stop();
      }
      video.srcObject = null;
    },
  }
}
