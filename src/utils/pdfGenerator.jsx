import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

// Асинхронная загрузка шрифта как base64
const loadFontAsBase64 = async (path) => {
  const res = await fetch(path);
  const buffer = await res.arrayBuffer();
  const binary = Array.from(new Uint8Array(buffer))
    .map((b) => String.fromCharCode(b))
    .join('');
  return btoa(binary);
};

export const generatePDF = async (card) => {
  const link = card?.urlCopy || 'https://example.com';

  // Загрузка всех шрифтов
  const [montserratRegular, montserratBold, IBMPlexSerifItalic, ManropeRegular] = await Promise.all(
    [
      loadFontAsBase64('/fonts/Montserrat-Regular.ttf'),
      loadFontAsBase64('/fonts/Montserrat-Bold.ttf'),
      loadFontAsBase64('/fonts/IBMPlexSerif-MediumItalic.ttf'),
      loadFontAsBase64('/fonts/Manrope-Regular.ttf'),
    ],
  );

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.addFileToVFS('Montserrat-Regular.ttf', montserratRegular);
  pdf.addFont('Montserrat-Regular.ttf', 'MontserratRegular', 'normal');

  pdf.addFileToVFS('Manrope-Regular.ttf', ManropeRegular);
  pdf.addFont('Manrope-Regular.ttf', 'ManropeRegular', 'normal');

  pdf.addFileToVFS('Montserrat-Bold.ttf', montserratBold);
  pdf.addFont('Montserrat-Bold.ttf', 'MontserratBold', 'normal');

  pdf.addFileToVFS('IBMPlexSerif-MediumItalic.ttf', IBMPlexSerifItalic);
  pdf.addFont('IBMPlexSerif-MediumItalic.ttf', 'IBMPlexSerif', 'normal');

  pdf.setFont('MontserratBold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Присоединяйтесь к нашей', pageWidth / 2, 20, { align: 'center' });
  pdf.text('программе лояльности', pageWidth / 2, 26, { align: 'center' });

  pdf.setFont('IBMPlexSerif');
  pdf.setFontSize(22);
  pdf.setTextColor(195, 30, 60);
  pdf.text('Бонусы за покупки -', pageWidth / 2, 45, { align: 'center' });

  pdf.setFont('ManropeRegular');
  pdf.setFontSize(22);
  pdf.setTextColor(0, 0, 0);
  pdf.text('прямо в вашем телефоне!', pageWidth / 2, 55, { align: 'center' });

  const qrDataUrl = await QRCode.toDataURL(link);
  pdf.addImage(qrDataUrl, 'PNG', (pageWidth - 60) / 2, 75, 60, 60);

  pdf.setFont('MontserratRegular');
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Сканируйте QR-код,', pageWidth / 2, 160, { align: 'center' });
  pdf.text('чтобы установить электронную карту', pageWidth / 2, 167, { align: 'center' });
  pdf.text('в Apple Wallet или Google Pay', pageWidth / 2, 174, { align: 'center' });

  const buttonWidth = 60;
  const buttonHeight = 10;
  const buttonX = (pageWidth - buttonWidth) / 2;
  const buttonY = 190;
  const borderRadius = buttonHeight / 2;

  pdf.setDrawColor(183, 183, 183);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, borderRadius, borderRadius);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.textWithLink('www.loyalclub.ru', pageWidth / 2, buttonY + 7, {
    url: 'https://www.loyalclub.ru',
    align: 'center',
  });

  pdf.save(`card-${card.id || 'demo'}.pdf`);
};
