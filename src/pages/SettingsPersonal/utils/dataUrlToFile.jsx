const dataUrlToFile = async (dataUrl, fileName = 'image.jpg') => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
};

export default dataUrlToFile;
