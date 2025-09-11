import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { YMaps } from '@pbe/react-yandex-maps';

import EditLayout from '../../components/EditLayout';
import TitleWithHelp from '../../components/TitleWithHelp';
import CustomTooltip from '../../customs/CustomTooltip';
import {
  addCurrentCardArrayItem,
  removeCurrentCardArrayItem,
  updateCurrentCardField,
} from '../../store/cardsSlice';
import { BarcodeRadioTitle, CreateButton } from '../EditDesign/styles';
import BarcodeRadio from '../EditSettings/BarcodeRadio';
import ActiveLinks from './ActiveLinks';
import ClientContactFields from './ClientContactFields';
import LabeledTextarea from './LabeledTextarea';
import PolicyFields from './PolicyFields';
import ReferralProgramConfig from './ReferralProgramConfig';
import ReviewLinks from './ReviewLinks';
import {
  Divider,
  Hr,
  SettingsInputsContainer,
  StampSectionLabel,
  StepNote,
  SubtitleText,
  TopRow,
} from './styles';

const EditInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentCard = useSelector((state) => state.cards.currentCard);
  const cardStatus = currentCard?.status;
  const formRef = useRef(null);

  const user = useSelector((state) => state.user);

  // Prefill issuer fields from organization/user data on first render
  useEffect(() => {
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

  const infoFields = currentCard?.infoFields || {
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

  const handleSave = () => {
    dispatch(updateCurrentCardField({ path: 'infoReady', value: true }));
    navigate(`/cards/${id}/edit/integration`);
  };

  const infoContent = (
    <SettingsInputsContainer ref={formRef}>
      <div>
        <TopRow>
          <TitleWithHelp
            title={'Оборотная сторона карты'}
            tooltipId="info-help"
            tooltipHtml
            tooltipContent={`Здесь вы можете описать условия вашей акции или программы лояльности — так, как хотите донести это до клиента. Например: Штампы начисляются при покупке от 300 ₽. Срок действия — 30 дней.`}
          />
          <StepNote>Шаг 4 из 5</StepNote>
        </TopRow>
        <Divider />
      </div>

      <LabeledTextarea
        label="Описание карты"
        value={infoFields.description}
        onChange={handleFieldChange('description')}
        placeholder="Введите описание карты"
        tooltip="Укажите краткое описание бонусной программы"
        required
        dataKey="description"
        showCounter
        maxLength={300}
        warnAt={20}
      />
      {cardStatus === 'stamp' && (
        <LabeledTextarea
          label="Как клиенту получить штамп"
          tooltip="Расскажите как использовать карту"
          value={infoFields.howToGetStamp}
          onChange={handleFieldChange('howToGetStamp')}
          placeholder=""
          required
          dataKey="howToGetStamp"
          showCounter
          maxLength={300}
          warnAt={20}
        />
      )}
      <LabeledTextarea
        label="Название компании"
        tooltip="Укажите наименование компании"
        value={infoFields.companyName}
        onChange={handleFieldChange('companyName')}
        placeholder="Название компании"
        required
        dataKey="companyName"
        showCounter
        maxLength={300}
        warnAt={20}
      />
      <LabeledTextarea
        label="Описание награды"
        tooltip="Укажите описание награды, которую получит клиент"
        value={infoFields.rewardDescription}
        onChange={handleFieldChange('rewardDescription')}
        placeholder=""
        required
        dataKey="rewardDescription"
        showCounter
        maxLength={300}
        warnAt={20}
      />
      {cardStatus === 'stamp' && (
        <LabeledTextarea
          label="Сообщение о начисленном штампе"
          tooltip="Текст push-сообщения о начисленном штампе"
          value={infoFields.stampMessage}
          subtitle={'Тег {#} обязателен для заполнения'}
          onChange={handleFieldChange('stampMessage')}
          placeholder=""
          required
          dataKey="stampMessage"
          showCounter
          maxLength={300}
          warnAt={20}
        />
      )}
      <LabeledTextarea
        label="Сообщение о начисленной награде"
        tooltip="Текст push-сообщения о полученной награде"
        value={infoFields.claimRewardMessage}
        onChange={handleFieldChange('claimRewardMessage')}
        placeholder=""
        required
        dataKey="claimRewardMessage"
        showCounter
        maxLength={300}
        warnAt={20}
      />

      {cardStatus === 'stamp' && (
        <>
          <Hr />

          {/* Если вернёшь поле — оно будет работать как раньше */}
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
        </>
      )}

      <Hr />

      <ReferralProgramConfig />

      <Hr />

      <StampSectionLabel>
        <BarcodeRadioTitle>Активные ссылки</BarcodeRadioTitle>
        <CustomTooltip
          id="active-links-help"
          html
          content={
            'Ссылки будут отображаться на обратной стороне карты, можно указать ваш телефон или ссылку на сайт'
          }
        />
      </StampSectionLabel>
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

      <Hr />

      <div>
        <StampSectionLabel>
          <BarcodeRadioTitle>Отзывы в сервисах</BarcodeRadioTitle>
          <CustomTooltip
            id="service-links-help"
            html
            content={'Ссылки на сервисы, где клиент может оставить отзыв'}
          />
        </StampSectionLabel>
        <SubtitleText>
          Добавьте ссылки на ваш бизнес. Это поможет клиенту оставить положительный отзыв, а вам
          поднимет рейтинг в поиске.
        </SubtitleText>
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

      <Hr />

      <PolicyFields
        policyEnabled={infoFields.policyEnabled}
        fullPolicyText={infoFields.fullPolicyText}
        linkToFullTerms={infoFields.linkToFullTerms}
      />

      <Hr />
      <StampSectionLabel>
        <BarcodeRadioTitle>Сведения об эмитенте карты</BarcodeRadioTitle>
        <CustomTooltip
          id="company-help"
          html
          content={'Информация об эмитенте карты, будет отображаться на обратной стороне карты'}
        />
      </StampSectionLabel>
      <ClientContactFields
        name={infoFields.issuerName}
        email={infoFields.issuerEmail}
        phone={infoFields.issuerPhone}
        onChange={(field, value) =>
          dispatch(updateCurrentCardField({ path: `infoFields.${field}`, value }))
        }
      />

      <CreateButton onClick={handleSave}>Перейти к следующему шагу</CreateButton>
    </SettingsInputsContainer>
  );

  return <EditLayout onFieldClick={flashInput}>{infoContent}</EditLayout>;
};

export default EditInfo;
