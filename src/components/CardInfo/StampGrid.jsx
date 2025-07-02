import React from 'react';

import { getStampLayout } from '../../utils/stampLayout';

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
  const iconSize = Math.floor((itemSize - itemPadding * 2) * 0.8);

  let currentStamp = 0;

  return (
    <div
      className="stamp-container"
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
    >
      {layout.map((itemsInRow, rowIndex) => (
        <div
          className="stamp-row"
          key={`row-${rowIndex}`}
          style={{
            display: 'flex',
            gap: `${gap}px`,
            justifyContent: 'center',
            marginBottom: rowIndex < totalRows - 1 ? `${gap}px` : 0,
          }}
        >
          {Array.from({ length: itemsInRow }).map((_, colIndex) => {
            if (currentStamp >= totalStamps) return null;

            const isActive = currentStamp < activeStamps;
            const stampNumber = currentStamp;
            currentStamp++;

            return (
              <div
                key={`stamp-${stampNumber}`}
                className={`stamp-item ${isActive && activeImage ? 'no-border' : ''} ${!isActive && inactiveImage ? 'no-border' : ''}`}
                style={{
                  width: `${itemSize}px`,
                  height: `${itemSize}px`,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? activeStampBgColor : inactiveStampBgColor,
                  padding: `${itemPadding}px`,
                  cursor: onStampClick ? 'pointer' : 'default',
                }}
                onClick={() => onStampClick && onStampClick(isActive)}
              >
                {isActive ? (
                  activeImage ? (
                    <img
                      src={activeImage}
                      alt="active-stamp"
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    <ActiveIcon width={iconSize} height={iconSize} color={activeColor} />
                  )
                ) : inactiveImage ? (
                  <img
                    src={inactiveImage}
                    alt="inactive-stamp"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  <InactiveIcon width={iconSize} height={iconSize} color={inactiveColor} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default StampGrid;
