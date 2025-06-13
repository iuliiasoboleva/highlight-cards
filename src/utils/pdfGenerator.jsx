import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

import { montserratFont } from '../fonts/montserrat-normal';

jsPDF.API.events.push([
  'addFonts',
  function () {
    this.addFileToVFS('Montserrat-Regular.ttf', montserratFont);
    this.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal');
  },
]);

export const generatePDF = async (card) => {
  const link = card?.urlCopy || 'https://example.com';
  const logoPath = '/logoColored.png';

  const logoDataUrl = await new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoPath;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });

  const qrDataUrl = await QRCode.toDataURL(link);

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFillColor(245, 243, 248);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setFont('Montserrat');
  pdf.setTextColor(30, 30, 30);

  pdf.setFontSize(14);
  pdf.text(card.name || 'Накопительная карта', pageWidth / 2, 20, { align: 'center' });

  pdf.setFontSize(18);
  pdf.text('Собирайте штампы для получения наград', pageWidth / 2, 35, { align: 'center' });

  pdf.addImage(qrDataUrl, 'PNG', 35, 60, 60, 60);

  pdf.setFontSize(11);
  pdf.setTextColor(100, 0, 0);
  pdf.textWithLink(link, 20, 130, { url: link });

  pdf.setFontSize(12);
  pdf.setTextColor(30, 30, 30);
  pdf.text('Просканируйте код камерой телефона', 110, 65);
  pdf.text('и установите карту в Apple Wallet', 110, 75);
  pdf.text('или Google Pay', 110, 85);

  pdf.setFontSize(16);
  pdf.text('Программа лояльности', pageWidth / 2, 145, { align: 'center' });

  const logoWidth = 50;
  const logoHeight = 25;
  const logoX = (pageWidth - logoWidth) / 2;
  const logoY = 150;
  pdf.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

  pdf.save(`card-${card.id}.pdf`);
};
