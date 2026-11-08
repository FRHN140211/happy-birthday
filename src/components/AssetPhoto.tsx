import { useState } from 'react';
import type { PhotoAsset } from '../config/content';

export function AssetPhoto({ asset, className = '', onPhotoReady, onPhotoError, alt }: {
  asset: PhotoAsset;
  className?: string;
  onPhotoReady?: (src: string) => void;
  onPhotoError?: (src: string) => void;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  const label = alt ?? asset.caption ?? asset.label;

  if (failed) {
    return (
      <div className={`asset-placeholder ${className}`} role="img" aria-label={`Photo placeholder: ${asset.label}`}>
        <span className="placeholder-flower" aria-hidden="true">✿</span>
        <span className="placeholder-label">Add {asset.label}</span>
        <code>{asset.src}</code>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={asset.src}
      alt={label}
      loading="lazy"
      onLoad={() => onPhotoReady?.(asset.src)}
      onError={() => {
        setFailed(true);
        onPhotoError?.(asset.src);
      }}
    />
  );
}
