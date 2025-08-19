import React from 'react';

import { getStampLayout } from '../../utils/stampLayout';
import { StampContainer, StampImage, StampItem, StampRow } from './styles';

const StampGrid = ({
  totalStamps = 10,
  activeStamps = 0,
  ActiveIcon,
  InactiveIcon,
  activeImage,
  inactiveImage,
  activeStampBgColor,
  inactiveStampBgColor,
  activeColor = '#000',
  inactiveColor = 'gray',
  borderColor = '#000',
  containerWidth = 200,
  containerHeight = 88,
  onStampClick,
  hoverActive,
  hoverInactive,
  hoverBorder,
}) => {
  const layout = getStampLayout(totalStamps);
  const maxItemsPerRow = Math.max(...layout);
  const totalRows = layout.length;

  const gap = 4;
  const paddingVertical = 8;
  const availableHeight = containerHeight - paddingVertical * 2 - gap * (totalRows - 1);
  const availableWidth = containerWidth - gap * (maxItemsPerRow - 1);

  const maxItemHeight = Math.floor(availableHeight / totalRows);
  const maxItemWidth = Math.floor(availableWidth / maxItemsPerRow);
  const itemSize = Math.min(maxItemWidth, maxItemHeight);
  const paddingRatio = 0.2;
  const itemPadding = Math.floor(itemSize * paddingRatio);
  const iconSize = Math.floor((itemSize - itemPadding * 2) * 0.95);

  let currentStamp = 0;

  return (
    <StampContainer width={containerWidth} height={containerHeight}>
      {layout.map((itemsInRow, rowIndex) => (
        <StampRow key={`row-${rowIndex}`} gap={gap} isLast={rowIndex === totalRows - 1}>
          {Array.from({ length: itemsInRow }).map((_, colIndex) => {
            if (currentStamp >= totalStamps) return null;

            const isActive = currentStamp < activeStamps;
            const stampNumber = currentStamp;
            currentStamp++;

            const highlight = (isActive && hoverActive) || (!isActive && hoverInactive);
            const noBorder = (isActive && !!activeImage) || (!isActive && !!inactiveImage);

            return (
              <StampItem
                key={`stamp-${stampNumber}`}
                size={itemSize}
                borderColor={borderColor}
                bgColor={isActive ? activeStampBgColor : inactiveStampBgColor}
                padding={itemPadding}
                clickable={!!onStampClick}
                $noBorder={noBorder}
                $hi={highlight}
                $hiBorder={!!hoverBorder}
                onClick={() => onStampClick && onStampClick(isActive)}
              >
                {isActive ? (
                  activeImage ? (
                    <StampImage src={activeImage} alt="active-stamp" />
                  ) : (
                    <ActiveIcon width={iconSize} height={iconSize} color={activeColor} />
                  )
                ) : inactiveImage ? (
                  <StampImage src={inactiveImage} alt="inactive-stamp" />
                ) : (
                  <InactiveIcon width={iconSize} height={iconSize} color={inactiveColor} />
                )}
              </StampItem>
            );
          })}
        </StampRow>
      ))}
    </StampContainer>
  );
};

export default StampGrid;
