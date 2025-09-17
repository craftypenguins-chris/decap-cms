import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { colors } from 'decap-cms-ui-default';

interface MirrorStatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  error?: string;
}

const StatusDot = styled.span<{ status: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: ${props => {
    switch (props.status) {
      case 'connected':
        return colors.successGreen;
      case 'error':
        return colors.errorRed;
      default:
        return colors.textFieldBorder;
    }
  }};
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  font-size: 12px;
  color: ${colors.text};
  background: ${colors.background};
  border-radius: 4px;
  margin-left: 8px;
`;

const StatusText = styled.span`
  margin-left: 4px;
`;

const MirrorStatusIndicator: React.FC<MirrorStatusIndicatorProps> = ({ 
  status, 
  lastSync, 
  error 
}) => {
  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return lastSync ? `Mirror synced ${new Date(lastSync).toLocaleTimeString()}` : 'Mirror connected';
      case 'error':
        return error ? `Mirror error: ${error}` : 'Mirror error';
      default:
        return 'Mirror offline';
    }
  };

  return (
    <StatusWrapper title={getStatusText()}>
      <StatusDot status={status} />
      <StatusText>Local Preview</StatusText>
    </StatusWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  status: state.mirrorStatus?.get('status') || 'disconnected',
  lastSync: state.mirrorStatus?.get('lastSync'),
  error: state.mirrorStatus?.get('error'),
});

export default connect(mapStateToProps)(MirrorStatusIndicator);
