import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import { Copy, Power, Wallet, X } from 'lucide-react';

import { copyCardAsync, deleteCardAsync, setCurrentCard, updateCard } from '../../store/cardsSlice';
import { downloadPkPass } from '../../utils/downloadPkPass';
import DeleteCardModal from '../DeleteCardModal';
import {
  ActionButton,
  ButtonsBlock,
  ButtonsWrapper,
  IconBtn,
  IconButtons,
  TemplateSelectButton,
} from './styles';

const CardButtons = ({ isFixed, cardId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isTemplatePage = location.pathname === '/cards/template';

  const card = useSelector((state) => state.cards.cards.find((c) => c.id === cardId));

  const [showDel, setShowDel] = React.useState(false);
  const [copyLoading, setCopyLoading] = React.useState(false);

  if (!card) return null;

  if (isFixed) {
    return (
      <ButtonsWrapper>
        {isTemplatePage ? (
          <ActionButton
            onClick={() => {
              dispatch(setCurrentCard({}));
              navigate('/cards/create');
            }}
          >
            Без шаблона
          </ActionButton>
        ) : (
          <>
            <ActionButton onClick={() => navigate('/cards/template')}>На шаблоне</ActionButton>
            <ActionButton
              onClick={() => {
                dispatch(setCurrentCard({}));
                navigate('/cards/create');
              }}
            >
              Без шаблона
            </ActionButton>
          </>
        )}
      </ButtonsWrapper>
    );
  }

  if (isTemplatePage) {
    const handleTemplateSelect = () => {
      dispatch(setCurrentCard(card));
      navigate('/cards/create');
    };

    return (
      <ButtonsWrapper>
        <TemplateSelectButton onClick={handleTemplateSelect}>Выбрать шаблон</TemplateSelectButton>
      </ButtonsWrapper>
    );
  }

  const handleToggleActive = () => {
    dispatch(
      updateCard({
        id: cardId,
        changes: { isActive: !card.isActive },
      }),
    );
  };

  const handleCopy = () => {
    setCopyLoading(true);
    dispatch(copyCardAsync(cardId))
      .unwrap()
      .finally(() => setCopyLoading(false));
  };

  const handleDelete = () => setShowDel(true);

  const handleDownloadPkPass = async () => {
    try {
      await downloadPkPass(cardId);
    } catch (e) {}
  };

  const confirmDelete = () => {
    dispatch(deleteCardAsync(cardId));
    setShowDel(false);
  };

  return (
    <ButtonsBlock>
      <ActionButton onClick={() => navigate(`/cards/${cardId}/info`)}>Перейти</ActionButton>
      <IconButtons>
        <IconBtn
          onClick={handleToggleActive}
          data-tooltip-id="card-action-tooltip"
          data-tooltip-html={card.isActive ? 'Деактивировать' : 'Активировать'}
        >
          <Power size={20} />
        </IconBtn>
        <IconBtn
          onClick={handleDownloadPkPass}
          data-tooltip-id="card-action-tooltip"
          data-tooltip-html="Apple Wallet"
        >
          <Wallet size={20} />
        </IconBtn>
        <IconBtn
          onClick={handleCopy}
          data-tooltip-id="card-action-tooltip"
          data-tooltip-html="Скопировать карту"
          disabled={copyLoading}
        >
          <Copy size={20} />
        </IconBtn>
        <IconBtn
          onClick={handleDelete}
          data-tooltip-id="card-action-tooltip"
          data-tooltip-html="Удалить карту"
        >
          <X size={20} />
        </IconBtn>
      </IconButtons>
      {showDel && (
        <DeleteCardModal
          cardName={card.name}
          onConfirm={confirmDelete}
          onCancel={() => setShowDel(false)}
        />
      )}
      <Tooltip
        id="card-action-tooltip"
        className="custom-tooltip"
        style={{
          backgroundColor: '#000',
          color: '#fff',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '4px',
          lineHeight: '1',
          whiteSpace: 'nowrap',
        }}
      />
    </ButtonsBlock>
  );
};

export default CardButtons;
