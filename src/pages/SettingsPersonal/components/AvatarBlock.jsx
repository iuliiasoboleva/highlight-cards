import React from 'react';

import {
  AvatarContainer,
  AvatarImage,
  AvatarImageWrapper,
  AvatarPlaceholder,
  AvatarUpload,
  AvatarUploadText,
  RemoveAvatarBtn,
} from '../styles';

const AvatarBlock = ({ user, fileInputKey, onAvatarInput, removeAvatarAction }) => {
  return (
    <AvatarContainer>
      {user.avatar ? (
        <>
          <AvatarImageWrapper>
            <AvatarImage
              src={user.avatar}
              alt="Аватар"
              onError={(e) => {
                e.target.onerror = null;
                removeAvatarAction();
              }}
            />
          </AvatarImageWrapper>
          <RemoveAvatarBtn type="button" onClick={removeAvatarAction}>
            Удалить фото
          </RemoveAvatarBtn>
        </>
      ) : (
        <AvatarUpload>
          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            onChange={onAvatarInput}
            style={{ display: 'none' }}
          />
          <AvatarPlaceholder>
            <span>+</span>
          </AvatarPlaceholder>
          <AvatarUploadText>Добавить фото</AvatarUploadText>
        </AvatarUpload>
      )}
    </AvatarContainer>
  );
};

export default AvatarBlock;
