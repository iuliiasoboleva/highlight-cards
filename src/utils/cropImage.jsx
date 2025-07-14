import { createImage } from '../helpers/createImage';

export const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180;

// Функция для поворота и расчета размера холста после поворота
function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export const getCroppedImg = async (
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  outputSize = { width: 320, height: 320 },
) => {
  const image = await createImage(imageSrc);
  const rotRad = getRadianAngle(rotation);

  // Создаем канвас для поворота изображения
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Перемещаем центр, вращаем и рисуем
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Получаем обрезанную область
  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  croppedCanvas.width = outputSize.width;
  croppedCanvas.height = outputSize.height;

  // Применяем зеркалирование после поворота и обрезки
  croppedCtx.save();
  croppedCtx.translate(
    flip.horizontal ? outputSize.width : 0,
    flip.vertical ? outputSize.height : 0,
  );
  croppedCtx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize.width,
    outputSize.height,
  );

  croppedCtx.restore();

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    }, 'image/jpeg');
  });
};
