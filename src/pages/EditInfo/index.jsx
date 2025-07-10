import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import { YMaps } from '@pbe/react-yandex-maps';
import { HelpCircle } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import QRPopup from '../../components/QRPopup';
import {
  addCurrentCardArrayItem,
  createCard,
  removeCurrentCardArrayItem,
  saveCard,
  updateCurrentCardField,
} from '../../store/cardsSlice';
import BarcodeRadio from '../EditSettings/BarcodeRadio';
import ActiveLinks from './ActiveLinks';
import ClientContactFields from './ClientContactFields';
import LabeledTextarea from './LabeledTextarea';
import PolicyFields from './PolicyFields';
import ReferralProgramConfig from './ReferralProgramConfig';
import ReviewLinks from './ReviewLinks';

import './styles.css';

const EditInfo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentCard = useSelector((state) => state.cards.currentCard);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const formRef = useRef(null);

  const user = useSelector((state) => state.user);
  const cards = useSelector((state) => state.cards.cards);
  const exists = cards.some((c) => c.id === currentCard.id && c.id !== 'fixed');

  // Prefill issuer fields from organization/user data on first render
  React.useEffect(() => {
    if (!currentCard) return;
    const updates = {};
    if (!currentCard.infoFields?.issuerName && user.company) updates.issuerName = user.company;
    if (!currentCard.infoFields?.issuerEmail && user.email) updates.issuerEmail = user.email;
    if (!currentCard.infoFields?.issuerPhone && user.phone) updates.issuerPhone = user.phone;
    if (Object.keys(updates).length) {
      dispatch(
        updateCurrentCardField({
          path: 'infoFields',
          value: { ...currentCard.infoFields, ...updates },
        }),
      );
    }
  }, [currentCard, user.company, user.email, user.phone, dispatch]);

  const infoFields = currentCard.infoFields || {
    description: '',
    howToGetStamp: '',
    companyName: '',
    rewardDescription: '',
    stampMessage: '',
    claimRewardMessage: '',
  };

  const flashInput = (key) => {
    const el = formRef.current?.querySelector(`[data-info-key="${key}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.focus();
    } else {
      const input = el.querySelector('input, textarea');
      input && input.focus();
    }
    el.classList.add('flash-border');
    setTimeout(() => el.classList.remove('flash-border'), 1000);
  };

  const handleFieldChange = useCallback(
    (field) => (e) => {
      const newInfoFields = {
        ...infoFields,
        [field]: e.target.value,
      };
      dispatch(updateCurrentCardField({ path: 'infoFields', value: newInfoFields }));
    },
    [dispatch, infoFields],
  );

  const handleMultiRewardsChange = (e) => {
    const rawValue = e.target.value;

    const numberArray = rawValue
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .map((item) => parseInt(item, 10))
      .filter((num) => !isNaN(num));

    dispatch(
      updateCurrentCardField({
        path: 'infoFields',
        value: {
          ...infoFields,
          multiRewardsInput: rawValue,
          multiRewards: numberArray,
        },
      }),
    );
  };

  const handleFinish = async () => {
    try {
      if (!exists) {
        await dispatch(createCard()).unwrap();
      } else {
        await dispatch(saveCard()).unwrap();
      }
    } catch (e) {
      console.error('Ошибка при создании/сохранении карты', e);
    }
    setShowQRPopup(true);
  };

  const infoContent = (
    <div className="settings-inputs-container" ref={formRef}>
      <h2>
        Информация
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="info-help"
          data-tooltip-html="Настройка информации на тыльной стороне карты"
        />
      </h2>
      <Tooltip id="info-help" className="custom-tooltip" />
      <hr />

      <LabeledTextarea
        label="Описание карты"
        value={infoFields.description}
        onChange={handleFieldChange('description')}
        placeholder="Введите описание карты"
        tooltip="Укажите краткое описание бонусной программы"
        required
        dataKey="description"
      />
      <LabeledTextarea
        label="Как клиенту получить штамп"
        tooltip="Расскажите как использовать карту"
        value={infoFields.howToGetStamp}
        onChange={handleFieldChange('howToGetStamp')}
        placeholder=""
        required
        dataKey="howToGetStamp"
      />
      <LabeledTextarea
        label="Название компании"
        tooltip="Укажите наименование компании"
        value={infoFields.companyName}
        onChange={handleFieldChange('companyName')}
        placeholder="Название компании"
        required
        dataKey="companyName"
      />
      <LabeledTextarea
        label="Описание награды"
        tooltip="Укажите описание награды, которую получит клиент"
        value={infoFields.rewardDescription}
        onChange={handleFieldChange('rewardDescription')}
        placeholder=""
        required
        dataKey="rewardDescription"
      />
      <LabeledTextarea
        label="Сообщение о начисленном штампе"
        tooltip="Текст push-сообщения о начисленном штампе"
        value={infoFields.stampMessage}
        subtitle={'Тег {#} обязателен для заполнения'}
        onChange={handleFieldChange('stampMessage')}
        placeholder=""
        required
        dataKey="stampMessage"
      />
      <LabeledTextarea
        label="Сообщение о начисленной награде"
        tooltip="Текст push-сообщения о полученной награде"
        value={infoFields.claimRewardMessage}
        onChange={handleFieldChange('claimRewardMessage')}
        placeholder=""
        required
        dataKey="claimRewardMessage"
      />
      <hr />
      {/* <LabeledTextarea
        label="Мультинаграды"
        subtitle={
          'Укажите через запятую, при каких количествах полученных штампов будет начисляться данная награда. Если оставить поле пустым, то награда будет начисляться при достижении максимального количества штампов.'
        }
        value={infoFields.multiRewardsInput || ''}
        onChange={handleMultiRewardsChange}
        placeholder="Например: 3,5,7"
      /> */}
      <BarcodeRadio
        options={[
          { value: 'true', label: 'Да' },
          { value: 'false', label: 'Нет' },
        ]}
        title="Списывать награду автоматически?"
        subtitle="После накопления необходимого количества штампов награда будет списана автоматически при очередном визите"
        selected={String(infoFields.autoRedeem)}
        onChange={(value) => {
          dispatch(
            updateCurrentCardField({ path: 'infoFields.autoRedeem', value: value === 'true' }),
          );
        }}
        name="auto-redeem"
        dataKey="autoRedeem"
        additionalContentByValue={{}}
      />

      <hr />
      <ReferralProgramConfig />
      <hr />
      <h3 className="barcode-radio-title">
        Активные ссылки
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="active-links-help"
          data-tooltip-html="Ссылки будут отображаться на обратной стороне карты, можно указать ваш телефон или ссылку на сайт"
        />
      </h3>
      <Tooltip id="active-links-help" className="custom-tooltip" />
      <YMaps
        query={{
          apikey: 'a886f296-c974-43b3-aa06-a94c782939c2',
          lang: 'ru_RU',
          load: 'package.suggest',
        }}
      >
        <ActiveLinks
          formFields={currentCard.infoFields.activeLinks}
          onFieldChange={(index, key, value) =>
            dispatch(
              updateCurrentCardField({ path: `infoFields.activeLinks.${index}.${key}`, value }),
            )
          }
          onAddField={() =>
            dispatch(
              addCurrentCardArrayItem({
                path: 'infoFields.activeLinks',
                item: { type: 'url', link: 'https://', text: '' },
              }),
            )
          }
          onRemoveField={(index) =>
            dispatch(removeCurrentCardArrayItem({ path: 'infoFields.activeLinks', index }))
          }
        />
      </YMaps>
      <hr />
      <div>
        <h3 className="barcode-radio-title">
          Отзывы в сервисах
          <HelpCircle
            size={16}
            style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
            data-tooltip-id="service-links-help"
            data-tooltip-html="Ссылки на сервисы, где клиент может оставить отзыв"
          />
        </h3>
        <Tooltip id="service-links-help" className="custom-tooltip" />
        <p className="labeled-textarea-subtitle">
          Добавьте ссылки на ваш бизнес. Это поможет клиенту оставить положительный отзыв, а вам
          поднимет рейтинг в поиске.
        </p>
      </div>
      <ReviewLinks
        formFields={currentCard.infoFields.reviewLinks}
        onFieldChange={(index, key, value) =>
          dispatch(
            updateCurrentCardField({ path: `infoFields.reviewLinks.${index}.${key}`, value }),
          )
        }
        onAddField={() =>
          dispatch(
            addCurrentCardArrayItem({
              path: 'infoFields.reviewLinks',
              item: { type: '2gis', link: 'https://', text: '' },
            }),
          )
        }
        onRemoveField={(index) =>
          dispatch(removeCurrentCardArrayItem({ path: 'infoFields.reviewLinks', index }))
        }
      />
      <hr />
      <PolicyFields
        policyEnabled={infoFields.policyEnabled}
        fullPolicyText={infoFields.fullPolicyText}
        linkToFullTerms={infoFields.linkToFullTerms}
      />
      <hr />
      <h3 className="barcode-radio-title">
        Сведения об эмитенте карты
        <HelpCircle
          size={16}
          style={{ marginLeft: 6, cursor: 'pointer', outline: 'none' }}
          data-tooltip-id="company-help"
          data-tooltip-html="Информация об эмитенте карты, будет отображаться на обратной стороне карты"
        />
      </h3>
      <Tooltip id="company-help" className="custom-tooltip" />
      <ClientContactFields
        name={infoFields.issuerName}
        email={infoFields.issuerEmail}
        phone={infoFields.issuerPhone}
        onChange={(field, value) =>
          dispatch(updateCurrentCardField({ path: `infoFields.${field}`, value }))
        }
      />
      <button onClick={handleFinish} className="create-button">
        Завершить
      </button>
    </div>
  );

  return (
    <>
      <EditLayout onFieldClick={flashInput}>{infoContent}</EditLayout>
      {showQRPopup && (
        <QRPopup
          cardId={id}
          onClose={() => {
            setShowQRPopup(false);
            window.location.href = '/cards';
          }}
        />
      )}
    </>
  );
};

export default EditInfo;
