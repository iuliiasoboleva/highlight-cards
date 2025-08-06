import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const ProfileSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProfileCard = styled.div`
  width: 40%;
  height: fit-content;
  background: #fff;
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 12px;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

export const AvatarImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarUpload = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const AvatarPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  margin-bottom: 10px;

  span {
    font-size: 24px;
    color: #666;
  }
`;

export const AvatarUploadText = styled.span`
  color: #666;
  font-size: 14px;
`;

export const RemoveAvatarBtn = styled.button`
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 14px;
  margin-top: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ProfileName = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

export const ProfileEmail = styled.div`
  color: #666;
  font-size: 14px;
`;

export const ProfileRightBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
`;

export const ProfileForm = styled.div`
  flex: 1;
  background: #fff;
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 12px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  input,
  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-top: 4px;
  }
`;

export const MainButton = styled.button`
  background: #000;
  color: #fff;
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  margin-top: 16px;
  cursor: pointer;
  max-width: 250px;
  width: 100%;
  position: relative;
  overflow: hidden;
  font-size: 16px;
  font-weight: 500;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const ButtonProgress = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #b71c32 0%, #000 100%);
  transition: width 0.1s linear;
`;

export const DeleteSection = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 12px;
`;

export const CheckboxGroup = styled.div`
  label {
    margin: 8px 0;
  }
`;

export const DeleteTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  border-radius: 6px;
  padding: 10px;
  margin-top: 12px;
  border: 1px solid #ccc;
`;

export const Confirmation = styled.div`
  margin-top: 24px;

  input {
    width: 100%;
    padding: 10px;
    margin-top: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

export const Note = styled.p`
  font-size: 13px;
  color: #888;
  margin-top: 8px;
`;

export const DangerButton = styled(MainButton)`
  background-color: #d40000;
`;

export const Toast = styled.div`
  position: fixed;
  top: 90px;
  right: 40px;
  background: ${({ ok }) => (ok ? '#00c853' : '#e53935')};
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
`;

export const Label = styled.p`
  font-size: 12px;
  color: #656565;
  line-height: 1.66667;
`;

export const Input = styled.input`
  width: -webkit-fill-available;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    border-color: #bf4756;
  }
`;

export const PinInputWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

export const PinInput = styled.input`
  width: 60px;
  height: 60px;
  text-align: center;
  font-size: 32px;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  border-radius: 8px;
`;
