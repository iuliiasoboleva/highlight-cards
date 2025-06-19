import React, { useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { YMaps } from '@pbe/react-yandex-maps';
import { HelpCircle } from 'lucide-react';

import EditLayout from '../../components/EditLayout';
import QRPopup from '../../components/QRPopup';
import {
  addCurrentCardArrayItem,
  removeCurrentCardArrayItem,
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

  const infoContent = (
    <div className="settings-inputs-container" ref={formRef}>
      <h2>
        Информация <HelpCircle size={16} />
      </h2>
      <hr />

      <LabeledTextarea
        label="Описание карты"
        value={infoFields.description}
        onChange={handleFieldChange('description')}
        placeholder="Введите описание карты"
        required
        dataKey="description"
      />
      <LabeledTextarea
        label="Как клиенту получить штамп"
        value={infoFields.howToGetStamp}
        onChange={handleFieldChange('howToGetStamp')}
        placeholder=""
        required
        dataKey="howToGetStamp"
      />
      <LabeledTextarea
        label="Название компании"
        value={infoFields.companyName}
        onChange={handleFieldChange('companyName')}
        placeholder="Название компании"
        required
        dataKey="companyName"
      />
      <LabeledTextarea
        label="Описание награды"
        value={infoFields.rewardDescription}
        onChange={handleFieldChange('rewardDescription')}
        placeholder=""
        required
        dataKey="rewardDescription"
      />
      <LabeledTextarea
        label="Сообщение о начисленном штампе"
        value={infoFields.stampMessage}
        subtitle={'Тег {#} обязателен для заполнения'}
        onChange={handleFieldChange('stampMessage')}
        placeholder=""
        required
        dataKey="stampMessage"
      />
      <LabeledTextarea
        label="Сообщение о начисленной награде"
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
      <h3 className="barcode-radio-title">Активные ссылки</h3>
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
        <h3 className="barcode-radio-title">Отзывы в сервисах </h3>
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
      <h3 className="barcode-radio-title">Сведения об эмитенте карты </h3>
      <ClientContactFields
        name={infoFields.issuerName}
        email={infoFields.issuerEmail}
        phone={infoFields.issuerPhone}
        onChange={(field, value) =>
          dispatch(updateCurrentCardField({ path: `infoFields.${field}`, value }))
        }
      />
      <button onClick={() => setShowQRPopup(true)} className="create-button">
        Завершить
      </button>
    </div>
  );

  return (
    <>
      <EditLayout onFieldClick={flashInput}>{infoContent}</EditLayout>
      {showQRPopup && <QRPopup cardId={id} onClose={() => setShowQRPopup(false)} />}
    </>
  );
};

export default EditInfo;
