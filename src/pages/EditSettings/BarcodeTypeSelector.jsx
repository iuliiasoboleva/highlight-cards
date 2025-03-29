import React from 'react';

const BarcodeTypeSelector = ({ value, onChange }) => {
    return (
        <div className="form-section">
            <div className="section-title">Тип штрихкода</div>
            <div className="radio-group">
                <label className="radio-option">
                    <input
                        type="radio"
                        name="barcode"
                        value="pdf417"
                        checked={value === 'pdf417'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <span className="custom-radio" /> PDF 417
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="barcode"
                        value="qrcode"
                        checked={value === 'qrcode'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <span className="custom-radio" /> QR Code
                </label>
            </div>
        </div>
    );
};

export default BarcodeTypeSelector;
