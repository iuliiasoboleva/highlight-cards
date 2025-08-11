import React, { useMemo, useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import CustomInput from '../../customs/CustomInput';
import { mockClients, mockRFM } from '../../mocks/mockRFM';
import { countClientsBySegments } from '../../utils/countClientsBySegments';
import {
  Card,
  CardTitle,
  Content,
  EmptyCell,
  Field,
  Grid,
  Label,
  MainButton,
  Page,
  Row,
  Subtitle,
  Table,
  TableTitle,
  TableWrap,
  Td,
  Th,
  Warning,
} from './styles';

const SettingsRFMSegment = () => {
  const [segments, setSegments] = useState(mockRFM);
  const [savedSegments, setSavedSegments] = useState(mockRFM);

  const [open, setOpen] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], [field]: value };
    setSegments(updated);
  };

  const handleSave = (index) => {
    setSavedSegments((prev) =>
      prev.map((seg, i) => (i === index ? { ...seg, ...segments[index] } : seg)),
    );
  };

  const counts = useMemo(() => countClientsBySegments(savedSegments, mockClients), [savedSegments]);

  return (
    <Page>
      <h2>Сегментация клиентов</h2>

      <Subtitle onClick={() => setOpen(!open)}>
        Что такое RFM-сегментация клиентской базы?
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </Subtitle>

      {open && (
        <Content>
          <p>
            <span>Мы делим клиентов на группы по двум параметрам:</span>
            <br />
            <br />- Частота — как часто клиент приходит или покупает
            <br />- Давность — сколько дней прошло с последнего визита или покупки
          </p>

          <p>
            <span>
              Это помогает точно выделять активных, уходящих и лояльных клиентов и делать для них
              персональные рассылки:
            </span>
            <br />
            <br />- Возвращать тех, кто давно не был
            <br />- Благодарить постоянных покупателей
            <br />- Мотивировать самых активных клиентов
          </p>
        </Content>
      )}

      <Warning>При изменении настроек все сегменты автоматически пересчитаются.</Warning>

      <Grid>
        {segments.map((segment, index) => (
          <Card key={segment.title}>
            <CardTitle>{segment.title}</CardTitle>

            <Row>
              <Field>
                <Label>Частота от (~кол-во раз)</Label>
                <CustomInput
                  type="number"
                  value={segment.freqFrom}
                  onChange={(e) => handleChange(index, 'freqFrom', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Частота до (~кол-во раз)</Label>
                <CustomInput
                  type="number"
                  value={segment.freqTo}
                  onChange={(e) => handleChange(index, 'freqTo', e.target.value)}
                />
              </Field>
            </Row>

            <Row>
              <Field>
                <Label>Давность от (~дней)</Label>
                <CustomInput
                  type="number"
                  value={segment.recencyFrom}
                  onChange={(e) => handleChange(index, 'recencyFrom', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Давность до (~дней)</Label>
                <CustomInput
                  type="number"
                  value={segment.recencyTo}
                  onChange={(e) => handleChange(index, 'recencyTo', e.target.value)}
                />
              </Field>
            </Row>

            <MainButton type="button" onClick={() => handleSave(index)}>
              Сохранить
            </MainButton>
          </Card>
        ))}
      </Grid>
      <TableTitle>Сводка по сегментам</TableTitle>

      {/* Сводная таблица */}
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>Название сегмента</Th>
              <Th>Количество клиентов</Th>
            </tr>
          </thead>
          <tbody>
            {savedSegments.length === 0 ? (
              <tr>
                <EmptyCell colSpan={2}>Нет данных</EmptyCell>
              </tr>
            ) : (
              savedSegments.map((seg, i) => (
                <tr key={seg.title}>
                  <Td>{seg.title}</Td>
                  <Td>{counts[i] ?? 0}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  );
};

export default SettingsRFMSegment;
