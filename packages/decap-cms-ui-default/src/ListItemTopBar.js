import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Icon from './Icon';
import { colors, lengths, buttons } from './styles';

const TopBar = styled.div`
  display: grid;
  grid-template-columns: 22px 22px 8px 1fr 22px;
  align-items: center;
  column-gap: 6px;
  height: 22px;
  border-radius: ${lengths.borderRadius} ${lengths.borderRadius} 0 0;
  position: relative;
`;

const TopBarButton = styled.button`
  ${buttons.button};
  color: ${colors.controlLabel};
  background: transparent;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  width: 22px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TopBarButtonSpan = TopBarButton.withComponent('span');

const DragIconContainer = styled(TopBarButtonSpan)`
  width: 22px;
  cursor: move;
`;

const LabelArea = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  color: ${colors.text};
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.span`
  display: inline-block;
  width: 100%;
  height: 14px;
  border-left: 1px solid ${colors.textFieldBorder};
`;

function DragHandle({ Wrapper, id }) {
  return (
    <Wrapper id={id}>
      <DragIconContainer>
        <Icon type="drag-handle" size="small" />
      </DragIconContainer>
    </Wrapper>
  );
}

function ListItemTopBar(props) {
  const {
    className,
    collapsed,
    onCollapseToggle,
    onRemove,
    allowRemove,
    dragHandle,
    allowReorder,
    id,
    label,
  } = props;
  return (
    <TopBar className={className}>
      {onCollapseToggle ? (
        <TopBarButton onClick={onCollapseToggle}>
          <Icon type="chevron" size="small" direction={collapsed ? 'right' : 'down'} />
        </TopBarButton>
      ) : null}
      {dragHandle && allowReorder ? <DragHandle Wrapper={dragHandle} id={id} /> : <span></span>}
      {collapsed && <Divider />}
      {collapsed && <LabelArea title={label}>{label}</LabelArea>}
      {onRemove && allowRemove ? (
        <TopBarButton onClick={onRemove}>
          <Icon type="close" size="small" />
        </TopBarButton>
      ) : (
        <span></span>
      )}
    </TopBar>
  );
}

ListItemTopBar.propTypes = {
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  onCollapseToggle: PropTypes.func,
  onRemove: PropTypes.func,
  allowRemove: PropTypes.bool,
  allowReorder: PropTypes.bool,
  label: PropTypes.string,
};

const StyledListItemTopBar = styled(ListItemTopBar)`
  display: grid;
  grid-template-columns: 22px 22px 8px 1fr 22px;
  align-items: center;
  column-gap: 6px;
  height: 22px;
  border-radius: ${lengths.borderRadius} ${lengths.borderRadius} 0 0;
  position: relative;
`;

export default StyledListItemTopBar;
