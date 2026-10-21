let sounds = {
  beep: function (frequency = 987, duration = 350, gain = 1.5) {
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const end = now + duration / 1000;

    const sine = ctx.createOscillator();
    sine.type = "sine";
    sine.frequency.value = frequency;

    const _gain = ctx.createGain();
    _gain.gain.value = gain;

    sine.connect(_gain);
    _gain.connect(ctx.destination);

    sine.start(now);
    sine.stop(end);
    sine.onended = () => ctx.close();
  },

  playLoading: function ({
    ctx = new AudioContext(),
    when = ctx.currentTime + 0.02,
    volume = 1,
  } = {}) {
    const LOADING = {
      tremolo: { rate: 9 },
      a: {
        start: 0,
        end: 0.39,
        attack: 0.003,
        release: 0.02,
        depth: 0.28,
        f0: 268.4,
        low: [265.8, 0.041],
        harmonics: [
          [20, 0.0185],
          [21, 0.0338],
          [22, 0.0528],
          [23, 0.0444],
          [24, 0.0354],
          [25, 0.0238],
        ],
      },
      burst: { start: 0.395, end: 0.48, gain: 0.14, lowHz: 4000, highHz: 9000 },
      c: {
        start: 0.41,
        rampTo: 0.51,
        end: 1.025,
        release: 0.02,
        depth: 0.25,
        f0: 216.9,
        low: [220.5, 0.028],
        harmonics: [
          [20, 0.0089],
          [21, 0.016],
          [22, 0.0372],
          [23, 0.0253],
          [24, 0.0246],
          [25, 0.0056],
        ],
      },
    };
    const L = LOADING;
    if (ctx.state === "suspended" && !ctx.startRendering) ctx.resume(); // not for OfflineAudioContext
    const T = (t) => when + t;
    const cosWave = ctx.createPeriodicWave(
      new Float32Array([0, 1]),
      new Float32Array([0, 0]),
      { disableNormalization: true },
    );

    // One buzz segment: pulse-like harmonic oscillator + low tone, shaped by an envelope and the tremolo
    function segment(seg) {
      const n = seg.harmonics[seg.harmonics.length - 1][0] + 1;
      const real = new Float32Array(n),
        imag = new Float32Array(n);
      for (const [k, a] of seg.harmonics) real[k] = a; // all cosines -> pulse-like buzz
      const buzz = new OscillatorNode(ctx, { frequency: seg.f0 });
      buzz.setPeriodicWave(
        ctx.createPeriodicWave(real, imag, { disableNormalization: true }),
      );
      const low = new OscillatorNode(ctx, { frequency: seg.low[0] });
      const lowGain = new GainNode(ctx, { gain: seg.low[1] });

      const env = new GainNode(ctx, { gain: 0 }); // envelope
      const trem = new GainNode(ctx, { gain: 1 }); // tremolo: 1 + depth*cos(...)
      const lfo = new OscillatorNode(ctx, { frequency: L.tremolo.rate });
      lfo.setPeriodicWave(cosWave);
      lfo.connect(new GainNode(ctx, { gain: seg.depth })).connect(trem.gain);

      const t0 = T(seg.start),
        t1 = T(seg.end);
      env.gain.setValueAtTime(0, t0);
      if (seg.rampTo)
        env.gain.linearRampToValueAtTime(volume, T(seg.rampTo)); // slow fade-in
      else env.gain.linearRampToValueAtTime(volume, t0 + seg.attack); // abrupt start
      env.gain.setValueAtTime(volume, t1 - seg.release);
      env.gain.linearRampToValueAtTime(0, t1);

      buzz.connect(env);
      low.connect(lowGain).connect(env);
      env.connect(trem).connect(ctx.destination);
      for (const o of [buzz, low, lfo]) {
        o.start(t0);
        o.stop(t1 + 0.01);
      }
    }
    segment(L.a);
    segment(L.c);

    // Noise burst between the two states
    const b = L.burst,
      len = Math.round(ctx.sampleRate * (b.end - b.start));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate),
      d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = new BiquadFilterNode(ctx, {
      type: "highpass",
      frequency: b.lowHz,
    });
    const lp = new BiquadFilterNode(ctx, {
      type: "lowpass",
      frequency: b.highHz,
    });
    const g = new GainNode(ctx, { gain: 0 });
    g.gain.setValueAtTime(0, T(b.start));
    g.gain.linearRampToValueAtTime(b.gain * volume, T(b.start) + 0.005);
    g.gain.setValueAtTime(b.gain * volume, T(b.end) - 0.005);
    g.gain.linearRampToValueAtTime(0, T(b.end));
    src.connect(hp).connect(lp).connect(g).connect(ctx.destination);
    src.start(T(b.start));

    return new Promise(
      (res) => (src.onended = () => setTimeout(res, (L.c.end - b.end) * 1000)),
    );
  },
};
