import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Group, Text, ActionIcon } from '@mantine/core';
import WaveSurfer from 'wavesurfer.js';
import { MantineLogo } from '@mantinex/mantine-logo';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
import classes from './AudioEditor.module.css';

interface AudioEditorProps {
  audioFile: File;
  opened: boolean;
  toggleNavbar: () => void;
}

export function AudioEditor({ audioFile, opened, toggleNavbar }: AudioEditorProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const regionsPlugin = useRef<RegionsPlugin | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      regionsPlugin.current = RegionsPlugin.create();

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4a83ff',
        progressColor: '#1a56e8',
        cursorColor: '#ffffff',
        barWidth: 2,
        barRadius: 3,
        height: 150,
        backend: 'WebAudio',
        plugins: [regionsPlugin.current],
      });

      wavesurfer.current.on('ready', () => {
        const duration = wavesurfer.current!.getDuration();
        setDuration(duration);
        setEndTime(duration);
        setStartTime(0);
        setIsReady(true);

        regionsPlugin.current!.addRegion({
          start: 0,
          end: duration,
          color: 'rgba(255, 255, 255, 0.3)',
          drag: false,
          resize: true,
        });
      });

      wavesurfer.current.on('error', (err) => {
        console.error('WaveSurfer error:', err);
      });

      wavesurfer.current.loadBlob(audioFile);
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleCut = async () => {
    if (wavesurfer.current && isReady) {
      const originalBuffer = wavesurfer.current.getDecodedData();
      if (originalBuffer) {
        const offlineAudioContext = new OfflineAudioContext(
          originalBuffer.numberOfChannels,
          Math.floor((endTime - startTime) * originalBuffer.sampleRate),
          originalBuffer.sampleRate
        );

        const source = offlineAudioContext.createBufferSource();
        source.buffer = originalBuffer;
        source.connect(offlineAudioContext.destination);
        source.start(0, startTime, endTime - startTime);

        const renderedBuffer = await offlineAudioContext.startRendering();

        const wavBlob = await new Promise<Blob>((resolve) => {
          const numberOfChannels = renderedBuffer.numberOfChannels;
          const length = renderedBuffer.length;
          const sampleRate = renderedBuffer.sampleRate;
          const wavDataView = createWavDataView(numberOfChannels, length, sampleRate, renderedBuffer);
          const wavBlob = new Blob([wavDataView], { type: 'audio/wav' });
          resolve(wavBlob);
        });

        wavesurfer.current.loadBlob(wavBlob);

        setDuration(renderedBuffer.duration);
        setStartTime(0);
        setEndTime(renderedBuffer.duration);

        regionsPlugin.current!.clearRegions();
        regionsPlugin.current!.addRegion({
          start: 0,
          end: renderedBuffer.duration,
          color: 'rgba(255, 255, 255, 0.3)',
          drag: false,
          resize: true,
        });

        wavesurfer.current.play();
      } else {
        console.error("Original buffer is not loaded.");
      }
    } else {
      console.error("Wavesurfer is not ready or does not exist.");
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  function createWavDataView(numChannels: number, length: number, sampleRate: number, audioBuffer: AudioBuffer): DataView {
    const buffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length * numChannels * 2, true);

    const channelData = new Float32Array(length);
    let offset = 44;
    for (let i = 0; i < numChannels; i++) {
      audioBuffer.copyFromChannel(channelData, i);
      for (let j = 0; j < length; j++) {
        const sample = Math.max(-1, Math.min(1, channelData[j]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return view;
  }

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  return (
    <Box className={classes.audioEditor}>
      {!opened && (
        <ActionIcon
          className={classes.menuButton}
          onClick={toggleNavbar}
          size="lg"
          variant="filled"
          color="blue"
          radius="xl"
        >
          <MantineLogo type="mark" size={24} />
        </ActionIcon>
      )}
      <div ref={waveformRef} className={classes.waveform} />

      <Group className={classes.controls}>
        <Text>Start: {formatTime(startTime)}</Text>
        <Group>
          <Button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</Button>
          <Button onClick={handleCut} disabled={!isReady}>Cut</Button>
          <Button>Save</Button>
        </Group>
        <Text>End: {formatTime(endTime)}</Text>
      </Group>
    </Box>
  );
}

export default AudioEditor;
