import styled, { css } from 'styled-components';

export const DesignSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    margin-bottom: 4px;
  }
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 8px;
  }
`;

export const StepNote = styled.span`
  margin-left: auto;
  color: #6b7280;
  font-size: 14px;

  @media (max-width: 640px) {
    margin-left: 0;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
`;

export const DesignRow = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

export const StampQuantityGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const StampQuantityButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #d5d5dd;
  background: #fff;
  color: #9f9fa7;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $active }) =>
    $active &&
    css`
      background: #000;
      color: #fff;
      border-color: #000;
    `}
`;

export const StampSettings = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StampSettingsBlock = styled.div`
  flex: 1;
  gap: 12px;
  display: flex;
  flex-direction: column;
`;

export const StampSectionLabel = styled.span`
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const UploadBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

export const UploadPlaceholder = styled.button`
  font-size: 24px;
  cursor: pointer;
  background: none;
  border: none;
`;

export const UploadButton = styled.button`
  background-color: #000;
  color: #fff;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  border: none;
`;

export const UploadDescription = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: #666;
`;

export const ColorSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-end;
`;

export const ColorInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;

  input[type='color'] {
    width: 48px;
    height: 36px;
    border: none;
    background: transparent;
    padding: 0;
  }

  input[type='text'] {
    height: 36px;
    padding: 4px 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

export const FullWidth = styled.div`
  flex-basis: 100%;
`;

export const InfoIcon = styled.span`
  font-size: 13px;
  margin-left: 6px;
  color: #888;
`;

export const PreviewImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

export const StampCountControl = styled.div`
  margin-bottom: 15px;

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

export const StampIconOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const StampIconOption = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  font-size: 18px;

  ${({ $active }) =>
    $active &&
    css`
      border-color: #2b7de3;
      background: #e6f0fd;
    `}
`;

export const SimpleImageUploader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const DragDropBox = styled.div`
  border: 1px dashed #d1d1d1;
  background-color: #fff;
  border-radius: 4px;
  padding: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ $dragOver }) =>
    $dragOver &&
    css`
      background-color: #f9f9f9;
      border-color: #888;
    `}
`;

export const DragIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  img {
    width: 40px;
    height: 40px;
    filter: brightness(0) saturate(0) invert(53%) sepia(7%) saturate(86%) hue-rotate(202deg)
      brightness(95%) contrast(92%);
  }
`;

export const FileButton = styled.button`
  background: ${({ $uploaded }) => ($uploaded ? '#4CAF50' : '#222')};
  color: #fff;
  padding: 10px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`;

export const FileNameBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  padding: 4px;

  &:hover {
    color: #d90000;
  }
`;

export const FileInfo = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #555;
  text-align: center;
  max-width: 350px;
`;

export const ColorSettingsItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ColorInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type='color'] {
    width: 40px;
    height: 40px;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  input[type='text'] {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

export const BarcodeRadioTitle = styled.h3`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const CreateButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #c14857;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 24px;
  transition: background-color 0.2s ease;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ColorOptionLabel = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: rgb(101, 101, 101);
  line-height: 1.66667;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CardFieldsHeader = styled.div`
  display: grid;
  align-items: center;
  margin-bottom: 10px;
  gap: 20px;
  grid-template-columns: 1fr 1fr;

  span {
    font-size: 12px;
    font-weight: 400;
    color: rgb(101, 101, 101);
    line-height: 1.66667;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CardFieldsRow = styled.div`
  display: grid;
  align-items: center;
  margin-bottom: 10px;
  gap: 20px;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 1320px) {
    grid-template-columns: 1fr;
  }
`;

export const MobileLabel = styled.span`
  display: none;
  font-size: 12px;
  color: #6c6c72;

  @media (max-width: 768px) {
    display: inline-block;
  }
`;
