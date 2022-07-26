export const canTorch = (stream: MediaStream): boolean => {
  const capabilities = stream.getVideoTracks()[0].getCapabilities();

  // eslint-disable-next-line no-type-assertion/no-type-assertion
  const torchAvailable = 'torch' in capabilities ? (capabilities as { torch: any }).torch : false;
  return Boolean(torchAvailable);
};

export const stopMediaStream = (stream: MediaStream) => {
  if (stream.getVideoTracks && stream.getAudioTracks) {
    stream.getVideoTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
    stream.getAudioTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
  } else {
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    (stream as unknown as MediaStreamTrack).stop();
  }
};
