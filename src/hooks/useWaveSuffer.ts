import { useEffect, useState } from 'react';
import { atom } from 'recoil';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
import Regions from 'wavesurfer.js/dist/plugins/regions.js';

export const wavesurferAtom = atom<WaveSurfer | null>({
  key: 'wavesurferAtom',
  default: null,
});

const useWavesurfer = (containerRef: React.RefObject<HTMLDivElement>, options: Omit<WaveSurferOptions, 'container'>) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [wsRegions, setWsRegions] = useState<Regions | null>(null);

  // wavesurfer 초기화
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current!,
    });

    const regions = ws.registerPlugin(Regions.create());

    setWavesurfer(ws);

    setWsRegions(regions);

    return () => {
      setWavesurfer(null);
      setWsRegions(null);
      ws.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    wavesurfer,
    wsRegions,
  };
};

export default useWavesurfer;
