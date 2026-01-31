
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { X, Mic, MicOff, Volume2, Sparkles, Loader2, Quote } from 'lucide-react';

interface TheOracleProps {
  word?: string;
  onClose: () => void;
}

// Audio Utils
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const TheOracle: React.FC<TheOracleProps> = ({ word, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [transcription, setTranscription] = useState<string>('');
  const [status, setStatus] = useState<string>('Bağlantı kuruluyor...');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const visualizerDataRef = useRef<Uint8Array | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    startSession();
    return () => stopSession();
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    setStatus('Ses geçidi yazılıyor...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setStatus('Kahin dinliyor.');
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            const analyzer = inputCtx.createAnalyser();
            analyzer.fftSize = 256;
            source.connect(analyzer);
            analyzerRef.current = analyzer;
            visualizerDataRef.current = new Uint8Array(analyzer.frequencyBinCount);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            
            const base64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64 && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
            
            if (message.serverContent?.turnComplete) {
              setTranscription('');
            }
          },
          onerror: (e) => console.error("Oracle Error:", e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          systemInstruction: `Sen Lexicon Elite'in Kahinisin, kadim ve bilge bir filolog. Entelektüel bir ciddiyet ve biraz gizemle Türkçe konuşuyorsun. Amacın, kullanıcının dilin en derin katmanlarını anlamasına yardımcı olmaktır. ${word ? `Şu anda şu kelime üzerine düşünüyoruz: ${word}.` : 'Kullanıcı genel olarak dilbilim hakkında konuşmak istiyor.'} Kısa ama zarif bir şekilde cevap ver.`,
          outputAudioTranscription: {},
        }
      });
      sessionRef.current = await sessionPromise;
      animate();
    } catch (e) {
      console.error("Failed to initiate oracle session:", e);
      onClose();
    }
  };

  const stopSession = () => {
    cancelAnimationFrame(requestRef.current);
    sessionRef.current?.close();
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
  };

  const animate = () => {
    if (analyzerRef.current && visualizerDataRef.current) {
      analyzerRef.current.getByteFrequencyData(visualizerDataRef.current);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  const getVisualizerScale = () => {
    if (!visualizerDataRef.current) return 1;
    const avg = visualizerDataRef.current.reduce((a, b) => a + b, 0) / visualizerDataRef.current.length;
    return 1 + (avg / 255) * 1.5;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white animate-fade-in overflow-hidden">
      {/* Background Mystical Aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C19A6B]/10 blur-[120px] transition-transform duration-100 ease-out"
          style={{ transform: `translate(-50%, -50%) scale(${getVisualizerScale() * 1.2})` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-2 border-[#C19A6B]/20 transition-transform duration-200"
          style={{ transform: `translate(-50%, -50%) scale(${getVisualizerScale()})` }}
        />
      </div>

      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative z-10 text-center space-y-12 w-full max-w-sm">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#C19A6B] uppercase tracking-[0.4em] animate-pulse">Dil Kahini Aktif</span>
          <h2 className="text-4xl font-serif font-bold text-white leading-tight">
            {isConnecting ? 'Geçit Açılıyor...' : `Danışılıyor: '${word || 'Dil'}'`}
          </h2>
        </div>

        <div className="relative flex items-center justify-center h-48">
          {isConnecting ? (
            <Loader2 className="w-12 h-12 text-[#C19A6B] animate-spin" />
          ) : (
            <div className="flex items-end gap-1.5 h-16">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1.5 bg-gradient-to-t from-[#C19A6B] to-[#F3E5AB] rounded-full animate-pulse" 
                  style={{ 
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.1}s`
                  }} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="min-h-[80px]">
           {transcription ? (
             <div className="animate-fade-in-down">
               <Quote className="w-6 h-6 text-[#C19A6B]/40 mx-auto mb-4" />
               <p className="font-serif italic text-lg text-gray-300 leading-relaxed">
                 {transcription}
               </p>
             </div>
           ) : (
             <p className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">
               {status}
             </p>
           )}
        </div>

        <div className="pt-8">
           <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-[#C19A6B] shadow-[0_0_30px_rgba(193,154,107,0.4)]' : 'bg-white/10'}`}>
              <Mic className="w-8 h-8 text-[#0F172A]" />
           </div>
           <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Kahin ile özgürce konuş</p>
        </div>
      </div>
      
      <div className="absolute bottom-12 left-0 right-0 text-center">
         <p className="text-[10px] text-gray-600 font-serif italic italic">"Dil, kültürün haritasıdır."</p>
      </div>
    </div>
  );
};

export default TheOracle;
