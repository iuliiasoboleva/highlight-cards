let pdfMakeLoadingPromise = null;

async function loadPdfMake() {
  if (window.pdfMake?.vfs) return window.pdfMake;
  if (!pdfMakeLoadingPromise) {
    pdfMakeLoadingPromise = new Promise((resolve, reject) => {
      const script1 = document.createElement('script');
      script1.src = 'https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/pdfmake.min.js';
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/vfs_fonts.js';
        script2.onload = () => resolve(window.pdfMake);
        script2.onerror = reject;
        document.body.appendChild(script2);
      };
      script1.onerror = reject;
      document.body.appendChild(script1);
    });
  }
  return pdfMakeLoadingPromise;
}

export async function generateInvoicePdf({ receiver, payer, invoice }) {
  const pdfMake = await loadPdfMake();

  const styles = {
    h1: { fontSize: 16, bold: true, margin: [0, 8, 0, 4] },
    h2: { fontSize: 12, bold: true, margin: [0, 8, 0, 2] },
    small: { fontSize: 9 },
    tableHeader: { bold: true, fillColor: '#f3f5f6' },
  };

  const toRuble = (v) => `${Number(v || 0).toLocaleString('ru-RU')} ₽`;
  const today = new Date(invoice.date || Date.now());
  const dateStr = today.toLocaleDateString('ru-RU');

  const itemsRows = invoice.items.map((it, idx) => [
    { text: String(idx + 1), alignment: 'center' },
    { text: it.name },
    { text: String(it.qty), alignment: 'center' },
    { text: it.unit || 'шт', alignment: 'center' },
    { text: toRuble(it.price), alignment: 'right' },
    { text: 'Без НДС', alignment: 'center' },
    { text: toRuble(it.price * it.qty), alignment: 'right' },
  ]);

  const docDefinition = {
    pageMargins: [32, 36, 32, 36],
    content: [
      { text: receiver.name, style: 'h1' },
      { text: `Счёт №${invoice.number} от ${dateStr}`, style: 'h1' },
      { columns: [
        [
          { text: 'Получатель', style: 'h2' },
          { text: `${receiver.name}` },
          { text: `ИНН ${receiver.inn}${receiver.kpp ? ' / КПП ' + receiver.kpp : ''}`, style: 'small' },
          { text: `${receiver.bank_name}`, style: 'small' },
          { text: `р/с ${receiver.checking_account}`, style: 'small' },
          { text: `к/с ${receiver.correspondent_account}`, style: 'small' },
          { text: `БИК ${receiver.bik}`, style: 'small' },
        ],
        [
          { text: 'Плательщик', style: 'h2' },
          { text: `${payer.name}` },
          { text: `ИНН ${payer.inn}${payer.kpp ? ' / КПП ' + payer.kpp : ''}`, style: 'small' },
          payer.legal_address ? { text: payer.legal_address, style: 'small' } : {},
          payer.phone ? { text: payer.phone, style: 'small' } : {},
        ],
      ]},

      { text: 'Назначение платежа', style: 'h2', margin: [0, 12, 0, 6] },
      { text: invoice.purpose || 'Плата за пользование сервисом Loyal Club по тарифу', margin: [0, 0, 0, 8] },

      {
        table: {
          headerRows: 1,
          widths: [20, '*', 40, 40, 70, 60, 80],
          body: [
            [
              { text: '№', style: 'tableHeader', alignment: 'center' },
              { text: 'Наименование товара или услуги', style: 'tableHeader' },
              { text: 'Кол-во', style: 'tableHeader', alignment: 'center' },
              { text: 'Ед.', style: 'tableHeader', alignment: 'center' },
              { text: 'Цена', style: 'tableHeader', alignment: 'right' },
              { text: 'НДС', style: 'tableHeader', alignment: 'center' },
              { text: 'Сумма', style: 'tableHeader', alignment: 'right' },
            ],
            ...itemsRows,
          ],
        },
        layout: 'lightHorizontalLines',
      },

      { columns: [
        { text: `Всего: ${invoice.items.length} наименование на сумму`, margin: [0, 10, 0, 0] },
        { text: toRuble(invoice.total), alignment: 'right', margin: [0, 10, 0, 0] },
      ]},

      { columns: [
        { text: `Итог к оплате: ${toRuble(invoice.total)}`, style: 'h2', margin: [0, 8, 0, 16] },
        { text: 'Без НДС', alignment: 'right', margin: [0, 8, 0, 16] },
      ]},

      { text: `Получатель: ${receiver.signatory || ''}`, margin: [0, 30, 0, 4] },
      { text: `Плательщик: ${payer.signatory || ''}` },
    ],
    styles,
    defaultStyle: { fontSize: 10 },
  };

  pdfMake.createPdf(docDefinition).download(`invoice_${invoice.number}.pdf`);
}

export function buildReceiverDefaults() {
  return {
    name: 'ООО "ПРО М8"',
    inn: '7743406170',
    kpp: '770301001',
    bank_name: 'ООО "Банк Точка"',
    checking_account: '40702810520000230757',
    correspondent_account: '30101810745374525104',
    bik: '044525104',
    signatory: 'Генеральный директор Яковлева Регина Ринатовна',
  };
}


