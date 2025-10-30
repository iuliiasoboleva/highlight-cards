import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { ChevronDown, ChevronUp } from 'lucide-react';

import axiosInstance from '../../axiosInstance';
import { useToast } from '../../components/Toast';
import CustomInput from '../../customs/CustomInput';
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

const DEFAULT_SEGMENTS = [
  { title: 'Требуют внимания', freqFrom: 8, freqTo: 12, recencyFrom: 61, recencyTo: 90 },
  { title: 'Лояльные - постоянные', freqFrom: 8, freqTo: 12, recencyFrom: 31, recencyTo: 60 },
  { title: 'Чемпионы', freqFrom: 8, freqTo: 12, recencyFrom: 0, recencyTo: 30 },
  { title: 'В зоне риска', freqFrom: 4, freqTo: 7, recencyFrom: 61, recencyTo: 90 },
  { title: 'Средние (на грани)', freqFrom: 4, freqTo: 7, recencyFrom: 31, recencyTo: 60 },
  { title: 'Растущие', freqFrom: 4, freqTo: 7, recencyFrom: 0, recencyTo: 30 },
];

const SettingsRFMSegment = () => {
  const user = useSelector((state) => state.user);
  const toast = useToast();

  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [savedSegments, setSavedSegments] = useState(DEFAULT_SEGMENTS);
  const [counts, setCounts] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    loadSegments();
  }, [user.organization_id]);

  const loadSegments = async () => {
    if (!user.organization_id) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/rfm-settings/`, {
        params: { organization_id: String(user.organization_id) },
      });

      if (response.data && response.data.length > 0) {
        const loadedSegments = response.data.map((s) => ({
          id: s.id,
          title: s.title,
          freqFrom: s.freq_from,
          freqTo: s.freq_to,
          recencyFrom: s.recency_from,
          recencyTo: s.recency_to,
        }));
        setSegments(loadedSegments);
        setSavedSegments(loadedSegments);
      } else {
        await initializeDefaultSegments();
      }

      await loadSegmentCounts();
    } catch (error) {
      console.error('Ошибка при загрузке настроек сегментации:', error);
      toast.error('Ошибка при загрузке настроек сегментации');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultSegments = async () => {
    try {
      for (const segment of DEFAULT_SEGMENTS) {
        await axiosInstance.post('/rfm-settings/', {
          organization_id: String(user.organization_id),
          title: segment.title,
          freq_from: segment.freqFrom,
          freq_to: segment.freqTo,
          recency_from: segment.recencyFrom,
          recency_to: segment.recencyTo,
        });
      }
      await loadSegments();
    } catch (error) {
      toast.error('Ошибка при инициализации настроек');
    }
  };

  const loadSegmentCounts = async () => {
    if (!user.organization_id) return;

    try {
      const response = await axiosInstance.get('/rfm-settings/segment-counts', {
        params: { organization_id: String(user.organization_id) },
      });
      setCounts(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке счетчиков сегментов:', error);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...segments];
    updated[index] = { ...updated[index], [field]: value };
    setSegments(updated);
  };

  const handleSave = async (index) => {
    const segment = segments[index];

    setSaving((prev) => ({ ...prev, [index]: true }));

    try {
      await axiosInstance.post('/rfm-settings/', {
        organization_id: String(user.organization_id),
        title: segment.title,
        freq_from: Number(segment.freqFrom),
        freq_to: Number(segment.freqTo),
        recency_from: Number(segment.recencyFrom),
        recency_to: Number(segment.recencyTo),
      });

      setSavedSegments((prev) =>
        prev.map((seg, i) => (i === index ? { ...seg, ...segments[index] } : seg)),
      );

      await loadSegmentCounts();

      toast.success('Настройки сегмента сохранены и пересчитаны');
    } catch (error) {
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setSaving((prev) => ({ ...prev, [index]: false }));
    }
  };

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

      {loading ? (
        <div>Загрузка...</div>
      ) : (
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
                    onChange={(e) => {
                      let raw = e.target.value;
                      // Убираем лидирующие нули
                      if (raw.length > 1 && raw.startsWith('0')) {
                        raw = raw.replace(/^0+/, '') || '0';
                        e.target.value = raw;
                      }
                      handleChange(index, 'freqFrom', raw);
                    }}
                  />
                </Field>
                <Field>
                  <Label>Частота до (~кол-во раз)</Label>
                  <CustomInput
                    type="number"
                    value={segment.freqTo}
                    onChange={(e) => {
                      let raw = e.target.value;
                      // Убираем лидирующие нули
                      if (raw.length > 1 && raw.startsWith('0')) {
                        raw = raw.replace(/^0+/, '') || '0';
                        e.target.value = raw;
                      }
                      handleChange(index, 'freqTo', raw);
                    }}
                  />
                </Field>
              </Row>

              <Row>
                <Field>
                  <Label>Давность от (~дней)</Label>
                  <CustomInput
                    type="number"
                    value={segment.recencyFrom}
                    onChange={(e) => {
                      let raw = e.target.value;
                      // Убираем лидирующие нули
                      if (raw.length > 1 && raw.startsWith('0')) {
                        raw = raw.replace(/^0+/, '') || '0';
                        e.target.value = raw;
                      }
                      handleChange(index, 'recencyFrom', raw);
                    }}
                  />
                </Field>
                <Field>
                  <Label>Давность до (~дней)</Label>
                  <CustomInput
                    type="number"
                    value={segment.recencyTo}
                    onChange={(e) => {
                      let raw = e.target.value;
                      // Убираем лидирующие нули
                      if (raw.length > 1 && raw.startsWith('0')) {
                        raw = raw.replace(/^0+/, '') || '0';
                        e.target.value = raw;
                      }
                      handleChange(index, 'recencyTo', raw);
                    }}
                  />
                </Field>
              </Row>

              <MainButton type="button" onClick={() => handleSave(index)} disabled={saving[index]}>
                {saving[index] ? 'Сохранение...' : 'Сохранить'}
              </MainButton>
            </Card>
          ))}
        </Grid>
      )}

      <TableTitle>Сводка по сегментам</TableTitle>

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
              savedSegments.map((seg) => (
                <tr key={seg.title}>
                  <Td>{seg.title}</Td>
                  <Td>{counts[seg.title] ?? 0}</Td>
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
