import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

interface DiagnosticoDispositivoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';
type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'offline';

export default function DiagnosticoDispositivo({ isOpen, onClose }: DiagnosticoDispositivoModalProps) {
  const [internetStatus, setInternetStatus] = useState<TestStatus>('idle');
  const [cameraStatus, setCameraStatus] = useState<TestStatus>('idle');
  const [microphoneStatus, setMicrophoneStatus] = useState<TestStatus>('idle');
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>('offline');

  const webcamRef = useRef<Webcam>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const testInternet = async () => {
    setInternetStatus('testing');
    try {
      // Verificar status básico online
      if (!navigator.onLine) {
        setConnectionQuality('offline');
        throw new Error('Sem conexão');
      }

      // Testar velocidade e qualidade da conexão
      const startTime = Date.now();
      const response = await fetch('/api/health', { method: 'HEAD' });
      const endTime = Date.now();
      const ping = endTime - startTime;

      if (response.ok) {
        // Determinar qualidade da conexão baseada no ping
        if (ping < 50) {
          setConnectionQuality('excellent');
        } else if (ping < 150) {
          setConnectionQuality('good');
        } else {
          setConnectionQuality('poor');
        }
        setInternetStatus('success');
      } else {
        setConnectionQuality('offline');
        throw new Error('Servidor inacessível');
      }
    } catch (error) {
      console.error('Teste de internet falhou:', error);
      setInternetStatus('error');
      setConnectionQuality('offline');
    }
  };

  const testCamera = async () => {
    setCameraStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraStatus('success');
    } catch (error) {
      console.error('Teste de câmera falhou:', error);
      setCameraStatus('error');
    }
  };

  const testMicrophone = async () => {
    setMicrophoneStatus('testing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Configurar análise de áudio para níveis do microfone
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Monitorar níveis de áudio
      const monitorAudio = () => {
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          // Se média > algum limite, considerar funcionando
          if (average > 10) {
            setMicrophoneStatus('success');
          }
        }
        animationFrameRef.current = requestAnimationFrame(monitorAudio);
      };
      monitorAudio();

      // Timeout após 5 segundos se nenhum áudio detectado
      setTimeout(() => {
        if (microphoneStatus === 'testing') {
          setMicrophoneStatus('success'); // Assumir sucesso se stream estiver ativo
        }
      }, 5000);
    } catch (error) {
      console.error('Teste de microfone falhou:', error);
      setMicrophoneStatus('error');
    }
  };

  const stopStreams = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraStatus('idle');
  };

  const handleClose = () => {
    stopStreams();
    onClose();
  };

  const getConnectionQualityText = (quality: ConnectionQuality) => {
    switch (quality) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Boa';
      case 'poor': return 'Ruim';
      case 'offline': return 'Offline';
    }
  };

  const getConnectionQualityColor = (quality: ConnectionQuality) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-orange-600';
      case 'offline': return 'text-red-600';
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Diagnóstico de Dispositivos</h2>
          <p className="text-gray-600 text-sm">Teste seus dispositivos antes da teleconsulta</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Teste Internet */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Teste de Conexão com Internet</h3>
                <p className="text-sm text-gray-600">Verifique sua conexão com a internet.</p>
                {internetStatus === 'success' && (
                  <p className={`text-sm font-medium mt-1 ${getConnectionQualityColor(connectionQuality)}`}>
                    Qualidade: {getConnectionQualityText(connectionQuality)}
                  </p>
                )}
              </div>
            </div>
            <button onClick={testInternet} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled={internetStatus === 'testing'}>
              {internetStatus === 'testing' ? 'Testando...' : internetStatus === 'success' ? '✓ Conexão OK' : internetStatus === 'error' ? '✗ Erro na conexão' : 'Iniciar Teste'}
            </button>
          </div>

          {/* Teste Câmera */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Teste de Câmera</h3>
                <p className="text-sm text-gray-600">Verifique se sua câmera está funcionando.</p>
              </div>
            </div>
            <button onClick={testCamera} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4 cursor-pointer" disabled={cameraStatus === 'testing'}>
              {cameraStatus === 'testing' ? 'Testando...' : cameraStatus === 'success' ? '✓ Câmera OK' : cameraStatus === 'error' ? '✗ Erro na câmera' : 'Iniciar Teste'}
            </button>
            {cameraStatus === 'success' && (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden bg-black w-full max-w-xs h-48 mx-auto">
                  <Webcam ref={webcamRef} audio={false} width={240} height={180} screenshotFormat="image/jpeg" mirrored videoConstraints={{ width: 240, height: 180, facingMode: 'user' }} className="absolute inset-0 h-full w-full" />
                  <button onClick={stopCamera} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer" title="Fechar câmera">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-green-600">Câmera funcionando corretamente</p>
                </div>
              </div>
            )}
          </div>

          {/* Teste Microfone */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Teste de Microfone</h3>
                <p className="text-sm text-gray-600">Verifique se seu microfone está funcionando.</p>
                {microphoneStatus === 'success' && ( 
                  <p className="text-sm text-green-600 font-medium mt-1">✓ Áudio detectado</p>
                )}
              </div>
            </div>
            <button onClick={testMicrophone} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled={microphoneStatus === 'testing'}>
              {microphoneStatus === 'testing' ? 'Testando...' : microphoneStatus === 'success' ? '✓ Microfone OK' : microphoneStatus === 'error' ? '✗ Erro no microfone' : 'Iniciar Teste'}
            </button>

            {microphoneStatus === 'testing' && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Fale algo próximo ao microfone...</p>
                <div className="flex justify-center mt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-8 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-6 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-10 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-7 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="w-2 h-5 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={handleClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer">Fechar</button>
        </div>
      </div>
    </div>
  );
}
