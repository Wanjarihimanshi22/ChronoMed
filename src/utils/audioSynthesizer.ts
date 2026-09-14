import { AlarmSoundTone } from '../types';

let audioCtx: AudioContext | null = null;
let currentOscillators: OscillatorNode[] = [];
let gainNode: GainNode | null = null;
let loopInterval: number | null = null;
let isAudioMuted: boolean = false;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuteState(muted: boolean) {
  isAudioMuted = muted;
  if (muted) {
    stopAlarmSound();
  }
}

export function getMuteState(): boolean {
  return isAudioMuted;
}

/**
 * Plays a pleasant one-shot completion chime (e.g. when logging a dose or reaching a goal)
 */
export function playSuccessChime() {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      noteGain.gain.setValueAtTime(0, now + idx * 0.08);
      noteGain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

      osc.connect(noteGain);
      noteGain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.7);
    });
  } catch (e) {
    console.warn('Audio chime playback error:', e);
  }
}

/**
 * Starts continuous or repeating alarm sound until stopped
 */
export function startAlarmSound(tone: AlarmSoundTone = 'gentle_chime') {
  if (isAudioMuted) return;
  stopAlarmSound();

  const playSingleCycle = () => {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (tone === 'gentle_chime') {
        // Warm 3-bell sequence
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);

          g.gain.setValueAtTime(0, now + i * 0.15);
          g.gain.linearRampToValueAtTime(0.2, now + i * 0.15 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.8);

          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.85);
          currentOscillators.push(osc);
        });
      } else if (tone === 'medical_pulse') {
        // Standard hospital two-beep telemetry reminder
        [880, 880, 1174.66].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.16);

          g.gain.setValueAtTime(0, now + i * 0.16);
          g.gain.linearRampToValueAtTime(0.22, now + i * 0.16 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.16 + 0.28);

          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + i * 0.16);
          osc.stop(now + i * 0.16 + 0.3);
          currentOscillators.push(osc);
        });
      } else if (tone === 'harmonic_bell') {
        // Resonant meditation bell
        [587.33, 880].forEach((freq) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(0.25, now + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0005, now + 1.6);

          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.65);
          currentOscillators.push(osc);
        });
      } else {
        // active_alert
        [750, 950].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + i * 0.18);

          g.gain.setValueAtTime(0, now + i * 0.18);
          g.gain.linearRampToValueAtTime(0.12, now + i * 0.18 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.25);

          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + i * 0.18);
          osc.stop(now + i * 0.18 + 0.26);
          currentOscillators.push(osc);
        });
      }
    } catch (err) {
      console.warn('Alarm audio error:', err);
    }
  };

  playSingleCycle();
  // Repeat every 2.4 seconds
  loopInterval = window.setInterval(playSingleCycle, 2400);
}

export function stopAlarmSound() {
  if (loopInterval !== null) {
    clearInterval(loopInterval);
    loopInterval = null;
  }
  currentOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {
      // already stopped
    }
  });
  currentOscillators = [];
  if (gainNode) {
    try {
      gainNode.disconnect();
    } catch {
      // pass
    }
    gainNode = null;
  }
}

/**
 * Helper to test audio tone briefly (e.g. in settings or test button)
 */
export function previewTone(tone: AlarmSoundTone) {
  stopAlarmSound();
  startAlarmSound(tone);
  setTimeout(() => {
    stopAlarmSound();
  }, 2200);
}
