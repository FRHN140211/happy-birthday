import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { composePhotobooth, type BoothLayout } from './composition';
import { boothTemplates, type TemplateId } from './templates';

type BoothPhase = 'idle' | 'countdown' | 'capturing' | 'result';
type CameraOption = { deviceId: string; label: string };
type SlotPhoto = string | null;

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function captureFrame(video: HTMLVideoElement): string {
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    throw new Error('The camera is still getting ready. Try again in a moment.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser cannot capture a photo.');

  context.save();
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.restore();

  return canvas.toDataURL('image/jpeg', 0.96);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('This browser cannot read that photo.'));
        return;
      }
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.96));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}. Try another image.`));
    };
    image.src = objectUrl;
  });
}

export function PhotoBooth({ birthdayDate, name }: { birthdayDate: string; name: string }) {
  const [templateId, setTemplateId] = useState<TemplateId>('pink');
  const [layout, setLayout] = useState<BoothLayout>('strip');
  const [phase, setPhase] = useState<BoothPhase>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<CameraOption[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState('');
  const [shots, setShots] = useState<SlotPhoto[]>(() => Array.from({ length: 4 }, () => null));
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captureIndex, setCaptureIndex] = useState(0);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [downloadMessage, setDownloadMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadSlotRef = useRef<number | null>(null);
  const template = useMemo(() => boothTemplates.find((item) => item.id === templateId) ?? boothTemplates[2], [templateId]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const resetSession = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStream(null);
    setShots(Array.from({ length: 4 }, () => null));
    setOutputBlob(null);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return '';
    });
    setCountdown(null);
    setCaptureIndex(0);
    setDownloadState('idle');
    setDownloadMessage('');
    setError('');
    setPhase('idle');
  }, []);

  const clearResult = useCallback(() => {
    setOutputBlob(null);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return '';
    });
    setCountdown(null);
    setCaptureIndex(0);
    setDownloadState('idle');
    setDownloadMessage('');
  }, []);

  useEffect(() => {
    resetSession();
  }, [resetSession]);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    videoRef.current.srcObject = stream;
    void videoRef.current.play().catch(() => setError('The camera preview could not start. Please try again or upload photos instead.'));
  }, [stream]);

  // stop camera only on unmount
  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  // revoke the old preview URL whenever it changes or on unmount
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const startCamera = useCallback(async (deviceId?: string) => {
    if (streamRef.current && videoRef.current) {
      setPhase('idle');
      return;
    }

    setError('');
    resetSession();

    if (!window.isSecureContext) {
      setError('Camera access needs a secure page (HTTPS or localhost). You can still choose four photos from your device.');
      setPhase('idle');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('This browser does not support camera access. You can choose four photos from your device instead.');
      setPhase('idle');
      return;
    }

    try {
      const videoConstraints: MediaTrackConstraints = deviceId
        ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 1600 } }
        : { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 1600 } };
      const nextStream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
      streamRef.current = nextStream;
      setStream(nextStream);
      const track = nextStream.getVideoTracks()[0];
      const settings = track?.getSettings();
      setActiveDeviceId(settings?.deviceId ?? deviceId ?? '');
      const inputs = (await navigator.mediaDevices.enumerateDevices())
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => ({ deviceId: device.deviceId, label: device.label || `Camera ${index + 1}` }));
      setDevices(inputs);
      setPhase('idle');
    } catch (cameraError) {
      const nameOfError = cameraError instanceof DOMException ? cameraError.name : '';
      if (nameOfError === 'NotAllowedError' || nameOfError === 'PermissionDeniedError') {
        setError('Camera permission was not granted. You can allow it in your browser settings, or choose four photos from your device.');
      } else if (nameOfError === 'NotFoundError' || nameOfError === 'DevicesNotFoundError') {
        setError('No camera was found on this device. Choose four photos from your device instead.');
      } else {
        setError('The camera could not be started. Check that another app is not using it, or choose photos instead.');
      }
      stopCamera();
      setPhase('idle');
    }
  }, [resetSession, stopCamera]);

  const chooseTemplate = (id: TemplateId) => {
    if (id === templateId) return;
    setError('');
    clearResult();
    setTemplateId(id);
    setPhase(shots.every(Boolean) ? 'result' : 'idle');
  };

  const captureFour = async () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    setError('');
    setPhase('countdown');
    const captured: SlotPhoto[] = [null, null, null, null];
    try {
      for (let index = 0; index < 4; index += 1) {
        setCaptureIndex(index);
        for (let number = 3; number > 0; number -= 1) {
          setCountdown(number);
          await wait(900);
        }
        setCountdown(null);
        captured[index] = captureFrame(video);
        setPhase('capturing');
        await wait(350);
      }
      setShots(captured);
      setPhase('result');
    } catch (captureError) {
      setError(captureError instanceof Error ? captureError.message : 'The photos could not be captured. Please try again.');
      setPhase('idle');
    }
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';
    const targetIndex = uploadSlotRef.current;
    uploadSlotRef.current = null;

    if (files.length === 0) return;

    stopCamera();
    setError('');
    setOutputBlob(null);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return '';
    });

    try {
      const converted = await Promise.all(files.map(fileToDataUrl));
      setShots((previous) => {
        const next = [...previous];
        if (targetIndex !== null) {
          next[targetIndex] = converted[0] ?? null;
          return next;
        }

        converted.forEach((dataUrl, index) => {
          if (index < next.length) next[index] = dataUrl;
        });
        return next;
      });
      setPhase('idle');
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Those photos could not be opened. Please try again.');
      setPhase('idle');
    }
  };
  useEffect(() => {
    if (phase === 'idle' && shots.every(Boolean)) setPhase('result');
  }, [phase, shots]);

  useEffect(() => {
    if (phase !== 'result' || !shots.every(Boolean)) return;
    let cancelled = false;
    void composePhotobooth(shots.filter(Boolean) as string[], template, layout, birthdayDate, name).then((blob) => {
      if (cancelled) return;
      setOutputBlob(blob);
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(blob);
      });
    }).catch((composeError: unknown) => {
      if (cancelled) return;
      setError(composeError instanceof Error ? composeError.message : 'The photo strip could not be created.');
      setPhase('idle');
    });
    return () => { cancelled = true; };
  }, [birthdayDate, layout, name, phase, shots, template]);

  const savePhoto = async () => {
    if (!outputBlob) return;
    setDownloadState('downloading');
    setDownloadMessage('Preparing your PNG…');

    try {
      const url = URL.createObjectURL(outputBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'My-Birthday-Photo-Strip.png';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
        try {
          const file = new File([outputBlob], 'My-Birthday-Photo-Strip.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My Birthday Photo Strip',
              text: 'A little birthday memory made just for you.',
              files: [file],
            });
          }
        } catch {
          // Ignore share-fallback issues and keep the direct download flow intact.
        }
      }

      setDownloadState('success');
      setDownloadMessage('Download ready! Your birthday strip is saved as a PNG.');
      window.setTimeout(() => {
        setDownloadState('idle');
        setDownloadMessage('');
        URL.revokeObjectURL(url);
      }, 2200);
    } catch (saveError) {
      setDownloadState('error');
      setDownloadMessage(saveError instanceof Error ? saveError.message : 'This PNG could not be downloaded. Please try again.');
    }
  };

  const changeLayout = (nextLayout: BoothLayout) => {
    if (nextLayout === layout) return;
    setLayout(nextLayout);
    if (shots.every(Boolean)) setPhase('result');
  };

  const retake = () => {
    resetSession();
    void startCamera(activeDeviceId || undefined);
  };

  return (
    <section className="scene scene-photobooth" aria-labelledby="booth-title">
      <div className="scene-kicker"><span>06</span><i /> BIRTHDAY PHOTOBOTH</div>
      <div className="booth-heading">
        <p className="eyebrow-script">ready for a photo?</p>
        <h1 id="booth-title">Birthday <em>Photobooth</em></h1>
        <p>Choose a frame, take your photos, and save the result.</p>
      </div>
      <div className="booth-layout">
        <div className="booth-controls">
          <div className="booth-step-label"><span>01</span> CHOOSE FRAME</div>
          <div className="template-options" role="radiogroup" aria-label="Photobooth frame">
            {boothTemplates.map((option) => (
              <button key={option.id} type="button" role="radio" aria-checked={templateId === option.id} onClick={() => chooseTemplate(option.id)} className={`template-option template-${option.id} ${templateId === option.id ? 'is-selected' : ''}`}>
                <span className="template-swatch" aria-hidden="true"><i /><i /><i /><i /></span>
                <span className="template-copy"><strong>{option.name}</strong><small>{option.description}</small></span>
                <span className="template-check" aria-hidden="true">{templateId === option.id ? '✓' : ''}</span>
              </button>
            ))}
          </div>
          <div className="booth-step-label booth-step-two"><span>02</span> CAMERA OR UPLOAD</div>
          <div className="booth-action-row">
            <button className="pill-button booth-start" type="button" onClick={() => void startCamera()} disabled={phase === 'countdown' || phase === 'capturing' || phase === 'result'}>
              <span className="camera-icon" aria-hidden="true">◎</span>{phase === 'idle' ? 'Open Camera' : 'Camera ready'}
            </button>
            <button className="upload-button" type="button" onClick={() => { uploadSlotRef.current = null; uploadRef.current?.click(); }} disabled={phase === 'countdown' || phase === 'capturing' || phase === 'result'}>Choose Photo</button>
            <input ref={uploadRef} className="visually-hidden" type="file" accept="image/*" multiple onChange={(event) => void handleUpload(event)} aria-label="Choose four photos from your device" />
          </div>
          <p className="booth-privacy"><span aria-hidden="true">✿</span> Your photos stay on this device. Nothing is uploaded.</p>
          {error && <p className="booth-error" role="alert">{error}</p>}
          {devices.length > 1 && phase !== 'result' && (
            <label className="camera-select-label">Choose camera
              <select value={activeDeviceId} onChange={(event) => void startCamera(event.target.value)} aria-label="Select camera">
                {devices.map((device, index) => <option value={device.deviceId} key={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>)}
              </select>
            </label>
          )}
        </div>
        <div className={`booth-preview booth-preview-${template.id}`}>
          <div className="preview-topline"><span>{name.toUpperCase()}'S BIRTHDAY PHOTO BOOTH</span><span>♡ {birthdayDate}</span></div>
          <div className="preview-screen">
            {phase === 'result' && previewUrl ? (
              <img className="booth-result-image" src={previewUrl} alt={`${name}'s ${layout === 'strip' ? 'birthday photo strip' : '2 by 2 photobooth'}`} />
            ) : stream && phase !== 'result' ? (
              <div className="camera-frame">
                <video ref={videoRef} autoPlay muted playsInline aria-label="Live camera preview" />
                <div className="camera-guide" aria-hidden="true"><span /><span /><span /><span /></div>
                {countdown !== null && <div className="countdown-overlay" aria-live="assertive"><strong>{countdown}</strong><small>PHOTO {captureIndex + 1} OF 4</small></div>}
                {phase === 'countdown' && countdown === null && <div className="flash-overlay" aria-hidden="true" />}
              </div>
            ) : (
              <div className="preview-empty"><span className="empty-camera-icon" aria-hidden="true">◎</span><p>Your photo strip<br />will appear here</p><small>Choose a frame, then open the camera</small></div>
            )}
          </div>
          {phase === 'result' ? (
            <div className="result-actions">
              <div className="layout-switch" aria-label="Photobooth layout">
                <button type="button" className={layout === 'strip' ? 'is-active' : ''} onClick={() => changeLayout('strip')}>Vertical strip</button>
                <button type="button" className={layout === 'grid' ? 'is-active' : ''} onClick={() => changeLayout('grid')}>2 × 2</button>
              </div>
              <div className="result-buttons">
                <button type="button" className="pill-button save-button" onClick={() => void savePhoto()} disabled={downloadState === 'downloading'}>
                  {downloadState === 'downloading' ? 'Preparing PNG…' : 'DOWNLOAD MY PHOTO STRIP'}
                  <span aria-hidden="true">↓</span>
                </button>
                <button type="button" className="outline-button" onClick={retake}>Retake</button>
              </div>
              {downloadMessage && <p className="booth-download-status" role="status">{downloadMessage}</p>}
              <div className="result-bottom"><span>PNG export · ready to download</span><button type="button" onClick={() => chooseTemplate(templateId)}>Change Template</button></div>
            </div>
          ) : (
            <div className="preview-bottom">
              <span>{phase === 'countdown' ? `CAPTURING ${captureIndex + 1} OF 4` : 'PHOTO PREVIEW'}</span>
              {phase === 'idle' && <button type="button" onClick={() => { if (streamRef.current) { void captureFour(); } else { void startCamera(); } }}>Take Photo <span aria-hidden="true">◎</span></button>}
              {phase === 'countdown' && <span className="capture-status">smile for a sec ♡</span>}
              {phase === 'capturing' && <span className="capture-status">photo captured</span>}
            </div>
          )}
        </div>
      </div>
      {phase === 'result' && (
        <div className="booth-finale" role="status">
          <span className="finale-flower" aria-hidden="true">✿</span>
          <div><p className="eyebrow-script">photo ready</p><h2>Your photo strip is ready.</h2><p>{name}'s birthday moment is saved.</p></div>
          <button type="button" className="another-button" onClick={() => void startCamera()}>Take Another Photo <span aria-hidden="true">↻</span></button>
        </div>
      )}
      <div className="booth-footnote"><span>NO UPLOADS · ON THIS DEVICE</span><span>Birthday Edition · {name}</span></div>
    </section>
  );
}
