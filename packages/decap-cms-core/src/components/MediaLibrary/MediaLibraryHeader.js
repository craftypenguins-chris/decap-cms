import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Icon, shadows, colors, buttons } from 'decap-cms-ui-default';

const CloseButton = styled.button`
  ${buttons.button};
  ${shadows.dropMiddle};
  position: absolute;
  margin-right: -40px;
  left: -40px;
  top: -40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LibraryTitle = styled.h1`
  line-height: 36px;
  font-size: 22px;
  text-align: left;
  margin-bottom: 25px;
  color: ${props => props.isPrivate && colors.textFieldBorder};
`;

function MediaLibraryHeader({ onClose, title, isPrivate, source, onChangeSource, showLocalPreview, breadcrumbs = [], onNavigateUp, onNavigateBreadcrumb }) {
  return (
    <div>
      <CloseButton onClick={onClose}>
        <Icon type="close" />
      </CloseButton>
      <LibraryTitle isPrivate={isPrivate}>{title}</LibraryTitle>
      {showLocalPreview ? (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => onChangeSource('repo')}
            style={{
              padding: '6px 10px',
              borderRadius: 4,
              border: '1px solid #ddd',
              background: source === 'repo' ? '#eef2ff' : '#fff',
              cursor: 'pointer',
            }}
          >
            Repo
          </button>
          <button
            type="button"
            onClick={() => onChangeSource('local_preview')}
            style={{
              padding: '6px 10px',
              borderRadius: 4,
              border: '1px solid #ddd',
              background: source === 'local_preview' ? '#eef2ff' : '#fff',
              cursor: 'pointer',
            }}
          >
            Local Preview
          </button>
        </div>
      ) : null}
      {showLocalPreview && breadcrumbs && breadcrumbs.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <button type="button" onClick={onNavigateUp} style={{ border: '1px solid #ddd', padding: '4px 8px', borderRadius: 4 }}>Up</button>
          <span>/</span>
          {breadcrumbs.map((seg, idx) => (
            <span key={idx}>
              <button type="button" onClick={() => onNavigateBreadcrumb(idx)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}>{seg}</button>
              {idx < breadcrumbs.length - 1 ? ' / ' : ''}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

MediaLibraryHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool,
  source: PropTypes.oneOf(['repo', 'local_preview']),
  onChangeSource: PropTypes.func,
  showLocalPreview: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(PropTypes.string),
  onNavigateUp: PropTypes.func,
  onNavigateBreadcrumb: PropTypes.func,
};

export default MediaLibraryHeader;
