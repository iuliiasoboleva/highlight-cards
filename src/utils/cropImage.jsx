import { createImage, getRadianAngle } from '../helpers/createImage';

export const getCroppedImg = async (
  imageSrc,
  crop,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const rotRad = getRadianAngle(rotation);
  const bBox = rotateSize(image.width, image.height, rotation);

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.translate(-crop.x, -crop.y);
  ctx.translate(bBox.width / 2, bBox.height / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, 'image/png');
  });
};

function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}
