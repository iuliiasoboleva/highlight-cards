import React from 'react';

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
}) => {
  const itemsPerRow = totalStamps <= 15 ? 5 : 10;
  const totalRows = Math.ceil(totalStamps / itemsPerRow);

  const paddingVertical = 8;
  const gap = 4;

  const availableHeight = containerHeight - paddingVertical * 2 - gap * (totalRows - 1);
  const availableWidth = containerWidth - gap * (itemsPerRow - 1);

  const maxItemHeight = Math.floor(availableHeight / totalRows);
  const maxItemWidth = Math.floor(availableWidth / itemsPerRow);
  const itemSize = Math.min(maxItemWidth, maxItemHeight);
  const iconSize = Math.floor(itemSize * 0.6);

  const paddingRatio = 0.2;
  const itemPadding = Math.floor(itemSize * paddingRatio);

  return (
    <div
      className="stamp-container"
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
    >
      {Array.from({ length: totalRows }).map((_, rowIndex) => (
        <div className="stamp-row" key={`row-${rowIndex}`}>
          {Array.from({ length: itemsPerRow }).map((_, colIndex) => {
            const stampNumber = rowIndex * itemsPerRow + colIndex;
            if (stampNumber >= totalStamps) return null;

            const isActive = stampNumber < activeStamps;

            return (
              <div
                key={`stamp-${stampNumber}`}
                className={`stamp-item ${isActive && activeImage ? 'no-border' : ''} ${
                  !isActive && inactiveImage ? 'no-border' : ''
                }`}
                style={{
                  width: `${itemSize}px`,
                  height: `${itemSize}px`,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: `${itemPadding}px`,
                  backgroundColor: isActive ? activeStampBgColor : inactiveStampBgColor,
                }}
              >
                {isActive ? (
                  activeImage ? (
                    <img
                      src={activeImage}
                      alt="active-stamp"
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    <ActiveIcon size={iconSize} color={activeColor} />
                  )
                ) : inactiveImage ? (
                  <img
                    src={inactiveImage}
                    alt="inactive-stamp"
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  <InactiveIcon size={iconSize} color={inactiveColor} />
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
