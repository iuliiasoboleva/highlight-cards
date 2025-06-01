import React from 'react';

const StampGrid = ({
  totalStamps = 10,
  activeStamps = 0,
  ActiveIcon,
  InactiveIcon,
  activeImage,
  inactiveImage,
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
                className={`stamp-item ${isActive && activeImage ? 'no-border' : ''} ${!isActive && inactiveImage ? 'no-border' : ''}`}
                style={{ width: `${itemSize}px`, height: `${itemSize}px` }}
              >
                {isActive ? (
                  activeImage ? (
                    <img
                      src={activeImage}
                      alt="active-stamp"
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <ActiveIcon size={iconSize} />
                  )
                ) : inactiveImage ? (
                  <img
                    src={inactiveImage}
                    alt="inactive-stamp"
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <InactiveIcon size={iconSize} />
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
