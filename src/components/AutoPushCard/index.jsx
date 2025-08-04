import React from 'react';

import ToggleSwitch from '../ToggleSwitch';
import { Button, Card, Input, Line, Subtitle, Textarea, Title, TitleRow } from './styles';

const AutoPushCard = ({
  title,
  message,
  delay,
  enabled,
  onChangeMessage,
  onChangeDelay,
  onToggle,
  onSave,
}) => {
  return (
    <Card>
      <TitleRow>
        <Title>{title}</Title>
        <ToggleSwitch checked={enabled} onChange={onToggle} />
      </TitleRow>

      <Subtitle>Уведомление о смене сегмента</Subtitle>
      <Line />
      <div>
        <Subtitle>Текст сообщения</Subtitle>
        <Textarea value={message} onChange={(e) => onChangeMessage(e.target.value)} />
      </div>

      <div>
        <Subtitle>
          Уведомление будет выслано через указанное количество часов после смены сегмента
        </Subtitle>
        <Input type="number" value={delay} onChange={(e) => onChangeDelay(e.target.value)} />
      </div>

      <Button onClick={onSave}>Сохранить</Button>
    </Card>
  );
};

export default AutoPushCard;
