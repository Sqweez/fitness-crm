let context = null;

// Short two-tone chime synthesized with Web Audio, no audio file needed.
// Browsers keep the context suspended until the user has interacted with the page.
export const playChatSound = () => {
  context = context || new AudioContext();
  context.resume();
  const start = context.currentTime;
  [880, 1320].forEach((frequency, index) => {
    const at = start + index * 0.15;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.3, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.35);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + 0.4);
  });
};
