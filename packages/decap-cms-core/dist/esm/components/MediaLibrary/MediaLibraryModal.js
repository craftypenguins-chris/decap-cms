import _styled from "@emotion/styled/base";
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import { translate } from 'react-polyglot';
import { colors } from 'decap-cms-ui-default';
import { Modal } from '../UI';
import MediaLibraryTop from './MediaLibraryTop';
import MediaLibraryCardGrid from './MediaLibraryCardGrid';
import EmptyMessage from './EmptyMessage';

/**
 * Responsive styling needs to be overhauled. Current setup requires specifying
 * widths per breakpoint.
 */
import { jsx as ___EmotionJSX } from "@emotion/react";
const cardWidth = `280px`;
const cardHeight = `240px`;
const cardMargin = `10px`;

/**
 * cardWidth + cardMargin * 2 = cardOutsideWidth
 * (not using calc because this will be nested in other calcs)
 */
const cardOutsideWidth = `300px`;
const StyledModal = /*#__PURE__*/_styled(Modal, {
  target: "e4d0svf0",
  label: "StyledModal"
})("display:grid;grid-template-rows:120px auto;width:calc(", cardOutsideWidth, " + 20px);background-color:", props => props.isPrivate && colors.grayDark, ";@media (min-width: 800px){width:calc(", cardOutsideWidth, " * 2 + 20px);}@media (min-width: 1120px){width:calc(", cardOutsideWidth, " * 3 + 20px);}@media (min-width: 1440px){width:calc(", cardOutsideWidth, " * 4 + 20px);}@media (min-width: 1760px){width:calc(", cardOutsideWidth, " * 5 + 20px);}@media (min-width: 2080px){width:calc(", cardOutsideWidth, " * 6 + 20px);}h1{color:", props => props.isPrivate && colors.textFieldBorder, ";}button:disabled,label[disabled]{background-color:", props => props.isPrivate && `rgba(217, 217, 217, 0.15)`, ";}" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01lZGlhTGlicmFyeS9NZWRpYUxpYnJhcnlNb2RhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEyQmlDIiwiZmlsZSI6Ii4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01lZGlhTGlicmFyeS9NZWRpYUxpYnJhcnlNb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBpc0VtcHR5IGZyb20gJ2xvZGFzaC9pc0VtcHR5JztcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gJ3JlYWN0LXBvbHlnbG90JztcbmltcG9ydCB7IGNvbG9ycyB9IGZyb20gJ2RlY2FwLWNtcy11aS1kZWZhdWx0JztcblxuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICcuLi9VSSc7XG5pbXBvcnQgTWVkaWFMaWJyYXJ5VG9wIGZyb20gJy4vTWVkaWFMaWJyYXJ5VG9wJztcbmltcG9ydCBNZWRpYUxpYnJhcnlDYXJkR3JpZCBmcm9tICcuL01lZGlhTGlicmFyeUNhcmRHcmlkJztcbmltcG9ydCBFbXB0eU1lc3NhZ2UgZnJvbSAnLi9FbXB0eU1lc3NhZ2UnO1xuXG4vKipcbiAqIFJlc3BvbnNpdmUgc3R5bGluZyBuZWVkcyB0byBiZSBvdmVyaGF1bGVkLiBDdXJyZW50IHNldHVwIHJlcXVpcmVzIHNwZWNpZnlpbmdcbiAqIHdpZHRocyBwZXIgYnJlYWtwb2ludC5cbiAqL1xuY29uc3QgY2FyZFdpZHRoID0gYDI4MHB4YDtcbmNvbnN0IGNhcmRIZWlnaHQgPSBgMjQwcHhgO1xuY29uc3QgY2FyZE1hcmdpbiA9IGAxMHB4YDtcblxuLyoqXG4gKiBjYXJkV2lkdGggKyBjYXJkTWFyZ2luICogMiA9IGNhcmRPdXRzaWRlV2lkdGhcbiAqIChub3QgdXNpbmcgY2FsYyBiZWNhdXNlIHRoaXMgd2lsbCBiZSBuZXN0ZWQgaW4gb3RoZXIgY2FsY3MpXG4gKi9cbmNvbnN0IGNhcmRPdXRzaWRlV2lkdGggPSBgMzAwcHhgO1xuXG5jb25zdCBTdHlsZWRNb2RhbCA9IHN0eWxlZChNb2RhbClgXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMTIwcHggYXV0bztcbiAgd2lkdGg6IGNhbGMoJHtjYXJkT3V0c2lkZVdpZHRofSArIDIwcHgpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLmlzUHJpdmF0ZSAmJiBjb2xvcnMuZ3JheURhcmt9O1xuXG4gIEBtZWRpYSAobWluLXdpZHRoOiA4MDBweCkge1xuICAgIHdpZHRoOiBjYWxjKCR7Y2FyZE91dHNpZGVXaWR0aH0gKiAyICsgMjBweCk7XG4gIH1cblxuICBAbWVkaWEgKG1pbi13aWR0aDogMTEyMHB4KSB7XG4gICAgd2lkdGg6IGNhbGMoJHtjYXJkT3V0c2lkZVdpZHRofSAqIDMgKyAyMHB4KTtcbiAgfVxuXG4gIEBtZWRpYSAobWluLXdpZHRoOiAxNDQwcHgpIHtcbiAgICB3aWR0aDogY2FsYygke2NhcmRPdXRzaWRlV2lkdGh9ICogNCArIDIwcHgpO1xuICB9XG5cbiAgQG1lZGlhIChtaW4td2lkdGg6IDE3NjBweCkge1xuICAgIHdpZHRoOiBjYWxjKCR7Y2FyZE91dHNpZGVXaWR0aH0gKiA1ICsgMjBweCk7XG4gIH1cblxuICBAbWVkaWEgKG1pbi13aWR0aDogMjA4MHB4KSB7XG4gICAgd2lkdGg6IGNhbGMoJHtjYXJkT3V0c2lkZVdpZHRofSAqIDYgKyAyMHB4KTtcbiAgfVxuXG4gIGgxIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5pc1ByaXZhdGUgJiYgY29sb3JzLnRleHRGaWVsZEJvcmRlcn07XG4gIH1cblxuICBidXR0b246ZGlzYWJsZWQsXG4gIGxhYmVsW2Rpc2FibGVkXSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5pc1ByaXZhdGUgJiYgYHJnYmEoMjE3LCAyMTcsIDIxNywgMC4xNSlgfTtcbiAgfVxuYDtcblxuZnVuY3Rpb24gTWVkaWFMaWJyYXJ5TW9kYWwoe1xuICBpc1Zpc2libGUsXG4gIGNhbkluc2VydCxcbiAgZmlsZXMsXG4gIGR5bmFtaWNTZWFyY2gsXG4gIGR5bmFtaWNTZWFyY2hBY3RpdmUsXG4gIGZvckltYWdlLFxuICBpc0xvYWRpbmcsXG4gIGlzUGVyc2lzdGluZyxcbiAgaXNEZWxldGluZyxcbiAgaGFzTmV4dFBhZ2UsXG4gIGlzUGFnaW5hdGluZyxcbiAgcHJpdmF0ZVVwbG9hZCxcbiAgcXVlcnksXG4gIHNlbGVjdGVkRmlsZSxcbiAgaGFuZGxlRmlsdGVyLFxuICBoYW5kbGVRdWVyeSxcbiAgdG9UYWJsZURhdGEsXG4gIGhhbmRsZUNsb3NlLFxuICBoYW5kbGVTZWFyY2hDaGFuZ2UsXG4gIGhhbmRsZVNlYXJjaEtleURvd24sXG4gIGhhbmRsZVBlcnNpc3QsXG4gIGhhbmRsZURlbGV0ZSxcbiAgaGFuZGxlSW5zZXJ0LFxuICBoYW5kbGVEb3dubG9hZCxcbiAgc2V0U2Nyb2xsQ29udGFpbmVyUmVmLFxuICBoYW5kbGVBc3NldENsaWNrLFxuICBoYW5kbGVMb2FkTW9yZSxcbiAgbG9hZERpc3BsYXlVUkwsXG4gIGRpc3BsYXlVUkxzLFxuICB0LFxuICBzb3VyY2UsXG4gIG9uQ2hhbmdlU291cmNlLFxuICBzaG93TG9jYWxQcmV2aWV3LFxuICBicmVhZGNydW1icyxcbiAgb25OYXZpZ2F0ZVVwLFxuICBvbk5hdmlnYXRlQnJlYWRjcnVtYixcbn0pIHtcbiAgY29uc3QgZmlsdGVyZWRGaWxlcyA9IGZvckltYWdlID8gaGFuZGxlRmlsdGVyKGZpbGVzKSA6IGZpbGVzO1xuICBjb25zdCBxdWVyaWVkRmlsZXMgPSAhZHluYW1pY1NlYXJjaCAmJiBxdWVyeSA/IGhhbmRsZVF1ZXJ5KHF1ZXJ5LCBmaWx0ZXJlZEZpbGVzKSA6IGZpbHRlcmVkRmlsZXM7XG4gIGNvbnN0IHRhYmxlRGF0YSA9IHRvVGFibGVEYXRhKHF1ZXJpZWRGaWxlcyk7XG4gIGNvbnN0IGhhc0ZpbGVzID0gZmlsZXMgJiYgISFmaWxlcy5sZW5ndGg7XG4gIGNvbnN0IGhhc0ZpbHRlcmVkRmlsZXMgPSBmaWx0ZXJlZEZpbGVzICYmICEhZmlsdGVyZWRGaWxlcy5sZW5ndGg7XG4gIGNvbnN0IGhhc1NlYXJjaFJlc3VsdHMgPSBxdWVyaWVkRmlsZXMgJiYgISFxdWVyaWVkRmlsZXMubGVuZ3RoO1xuICBjb25zdCBoYXNNZWRpYSA9IGhhc1NlYXJjaFJlc3VsdHM7XG4gIGNvbnN0IHNob3VsZFNob3dFbXB0eU1lc3NhZ2UgPSAhaGFzTWVkaWE7XG4gIGNvbnN0IGVtcHR5TWVzc2FnZSA9XG4gICAgKGlzTG9hZGluZyAmJiAhaGFzTWVkaWEgJiYgdCgnbWVkaWFMaWJyYXJ5Lm1lZGlhTGlicmFyeU1vZGFsLmxvYWRpbmcnKSkgfHxcbiAgICAoZHluYW1pY1NlYXJjaEFjdGl2ZSAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9SZXN1bHRzJykpIHx8XG4gICAgKCFoYXNGaWxlcyAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9Bc3NldHNGb3VuZCcpKSB8fFxuICAgICghaGFzRmlsdGVyZWRGaWxlcyAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9JbWFnZXNGb3VuZCcpKSB8fFxuICAgICghaGFzU2VhcmNoUmVzdWx0cyAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9SZXN1bHRzJykpO1xuXG4gIGNvbnN0IGhhc1NlbGVjdGlvbiA9IGhhc01lZGlhICYmICFpc0VtcHR5KHNlbGVjdGVkRmlsZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3R5bGVkTW9kYWwgaXNPcGVuPXtpc1Zpc2libGV9IG9uQ2xvc2U9e2hhbmRsZUNsb3NlfSBpc1ByaXZhdGU9e3ByaXZhdGVVcGxvYWR9PlxuICAgICAgPE1lZGlhTGlicmFyeVRvcFxuICAgICAgICB0PXt0fVxuICAgICAgICBvbkNsb3NlPXtoYW5kbGVDbG9zZX1cbiAgICAgICAgcHJpdmF0ZVVwbG9hZD17cHJpdmF0ZVVwbG9hZH1cbiAgICAgICAgZm9ySW1hZ2U9e2ZvckltYWdlfVxuICAgICAgICBvbkRvd25sb2FkPXtoYW5kbGVEb3dubG9hZH1cbiAgICAgICAgb25VcGxvYWQ9e2hhbmRsZVBlcnNpc3R9XG4gICAgICAgIHF1ZXJ5PXtxdWVyeX1cbiAgICAgICAgb25TZWFyY2hDaGFuZ2U9e2hhbmRsZVNlYXJjaENoYW5nZX1cbiAgICAgICAgb25TZWFyY2hLZXlEb3duPXtoYW5kbGVTZWFyY2hLZXlEb3dufVxuICAgICAgICBzZWFyY2hEaXNhYmxlZD17IWR5bmFtaWNTZWFyY2hBY3RpdmUgJiYgIWhhc0ZpbHRlcmVkRmlsZXN9XG4gICAgICAgIG9uRGVsZXRlPXtoYW5kbGVEZWxldGV9XG4gICAgICAgIGNhbkluc2VydD17Y2FuSW5zZXJ0fVxuICAgICAgICBvbkluc2VydD17aGFuZGxlSW5zZXJ0fVxuICAgICAgICBoYXNTZWxlY3Rpb249e2hhc1NlbGVjdGlvbn1cbiAgICAgICAgaXNQZXJzaXN0aW5nPXtpc1BlcnNpc3Rpbmd9XG4gICAgICAgIGlzRGVsZXRpbmc9e2lzRGVsZXRpbmd9XG4gICAgICAgIHNlbGVjdGVkRmlsZT17c2VsZWN0ZWRGaWxlfVxuICAgICAgICBzb3VyY2U9e3NvdXJjZX1cbiAgICAgICAgb25DaGFuZ2VTb3VyY2U9e29uQ2hhbmdlU291cmNlfVxuICAgICAgICBzaG93TG9jYWxQcmV2aWV3PXtzaG93TG9jYWxQcmV2aWV3fVxuICAgICAgICBicmVhZGNydW1icz17YnJlYWRjcnVtYnN9XG4gICAgICAgIG9uTmF2aWdhdGVVcD17b25OYXZpZ2F0ZVVwfVxuICAgICAgICBvbk5hdmlnYXRlQnJlYWRjcnVtYj17b25OYXZpZ2F0ZUJyZWFkY3J1bWJ9XG4gICAgICAvPlxuICAgICAgeyFzaG91bGRTaG93RW1wdHlNZXNzYWdlID8gbnVsbCA6IChcbiAgICAgICAgPEVtcHR5TWVzc2FnZSBjb250ZW50PXtlbXB0eU1lc3NhZ2V9IGlzUHJpdmF0ZT17cHJpdmF0ZVVwbG9hZH0gLz5cbiAgICAgICl9XG4gICAgICA8TWVkaWFMaWJyYXJ5Q2FyZEdyaWRcbiAgICAgICAgc2V0U2Nyb2xsQ29udGFpbmVyUmVmPXtzZXRTY3JvbGxDb250YWluZXJSZWZ9XG4gICAgICAgIG1lZGlhSXRlbXM9e3RhYmxlRGF0YX1cbiAgICAgICAgaXNTZWxlY3RlZEZpbGU9e2ZpbGUgPT4gc2VsZWN0ZWRGaWxlLmtleSA9PT0gZmlsZS5rZXl9XG4gICAgICAgIG9uQXNzZXRDbGljaz17aGFuZGxlQXNzZXRDbGlja31cbiAgICAgICAgY2FuTG9hZE1vcmU9e2hhc05leHRQYWdlfVxuICAgICAgICBvbkxvYWRNb3JlPXtoYW5kbGVMb2FkTW9yZX1cbiAgICAgICAgaXNQYWdpbmF0aW5nPXtpc1BhZ2luYXRpbmd9XG4gICAgICAgIHBhZ2luYXRpbmdNZXNzYWdlPXt0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubG9hZGluZycpfVxuICAgICAgICBjYXJkRHJhZnRUZXh0PXt0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5Q2FyZC5kcmFmdCcpfVxuICAgICAgICBjYXJkV2lkdGg9e2NhcmRXaWR0aH1cbiAgICAgICAgY2FyZEhlaWdodD17Y2FyZEhlaWdodH1cbiAgICAgICAgY2FyZE1hcmdpbj17Y2FyZE1hcmdpbn1cbiAgICAgICAgaXNQcml2YXRlPXtwcml2YXRlVXBsb2FkfVxuICAgICAgICBsb2FkRGlzcGxheVVSTD17bG9hZERpc3BsYXlVUkx9XG4gICAgICAgIGRpc3BsYXlVUkxzPXtkaXNwbGF5VVJMc31cbiAgICAgIC8+XG4gICAgPC9TdHlsZWRNb2RhbD5cbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IGZpbGVTaGFwZSA9IHtcbiAgZGlzcGxheVVSTDogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLm9iamVjdF0pLmlzUmVxdWlyZWQsXG4gIGlkOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGtleTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHF1ZXJ5T3JkZXI6IFByb3BUeXBlcy5udW1iZXIsXG4gIHNpemU6IFByb3BUeXBlcy5udW1iZXIsXG4gIHBhdGg6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbn07XG5cbk1lZGlhTGlicmFyeU1vZGFsLnByb3BUeXBlcyA9IHtcbiAgaXNWaXNpYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgY2FuSW5zZXJ0OiBQcm9wVHlwZXMuYm9vbCxcbiAgZmlsZXM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZShmaWxlU2hhcGUpKS5pc1JlcXVpcmVkLFxuICBkeW5hbWljU2VhcmNoOiBQcm9wVHlwZXMuYm9vbCxcbiAgZHluYW1pY1NlYXJjaEFjdGl2ZTogUHJvcFR5cGVzLmJvb2wsXG4gIGZvckltYWdlOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNMb2FkaW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNQZXJzaXN0aW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNEZWxldGluZzogUHJvcFR5cGVzLmJvb2wsXG4gIGhhc05leHRQYWdlOiBQcm9wVHlwZXMuYm9vbCxcbiAgaXNQYWdpbmF0aW5nOiBQcm9wVHlwZXMuYm9vbCxcbiAgcHJpdmF0ZVVwbG9hZDogUHJvcFR5cGVzLmJvb2wsXG4gIHF1ZXJ5OiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzZWxlY3RlZEZpbGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zaGFwZShmaWxlU2hhcGUpLCBQcm9wVHlwZXMuc2hhcGUoe30pXSksXG4gIGhhbmRsZUZpbHRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlUXVlcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHRvVGFibGVEYXRhOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVDbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlU2VhcmNoQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVTZWFyY2hLZXlEb3duOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVQZXJzaXN0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVEZWxldGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGhhbmRsZUluc2VydDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgc2V0U2Nyb2xsQ29udGFpbmVyUmVmOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVBc3NldENsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVMb2FkTW9yZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgbG9hZERpc3BsYXlVUkw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGRpc3BsYXlVUkxzOiBQcm9wVHlwZXMuaW5zdGFuY2VPZihNYXApLmlzUmVxdWlyZWQsXG4gIHNvdXJjZTogUHJvcFR5cGVzLm9uZU9mKFsncmVwbycsICdsb2NhbF9wcmV2aWV3J10pLFxuICBvbkNoYW5nZVNvdXJjZTogUHJvcFR5cGVzLmZ1bmMsXG4gIHNob3dMb2NhbFByZXZpZXc6IFByb3BUeXBlcy5ib29sLFxuICBicmVhZGNydW1iczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIG9uTmF2aWdhdGVVcDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uTmF2aWdhdGVCcmVhZGNydW1iOiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHRyYW5zbGF0ZSgpKE1lZGlhTGlicmFyeU1vZGFsKTtcbiJdfQ== */"));
function MediaLibraryModal({
  isVisible,
  canInsert,
  files,
  dynamicSearch,
  dynamicSearchActive,
  forImage,
  isLoading,
  isPersisting,
  isDeleting,
  hasNextPage,
  isPaginating,
  privateUpload,
  query,
  selectedFile,
  handleFilter,
  handleQuery,
  toTableData,
  handleClose,
  handleSearchChange,
  handleSearchKeyDown,
  handlePersist,
  handleDelete,
  handleInsert,
  handleDownload,
  setScrollContainerRef,
  handleAssetClick,
  handleLoadMore,
  loadDisplayURL,
  displayURLs,
  t,
  source,
  onChangeSource,
  showLocalPreview,
  breadcrumbs,
  onNavigateUp,
  onNavigateBreadcrumb
}) {
  const filteredFiles = forImage ? handleFilter(files) : files;
  const queriedFiles = !dynamicSearch && query ? handleQuery(query, filteredFiles) : filteredFiles;
  const tableData = toTableData(queriedFiles);
  const hasFiles = files && !!files.length;
  const hasFilteredFiles = filteredFiles && !!filteredFiles.length;
  const hasSearchResults = queriedFiles && !!queriedFiles.length;
  const hasMedia = hasSearchResults;
  const shouldShowEmptyMessage = !hasMedia;
  const emptyMessage = isLoading && !hasMedia && t('mediaLibrary.mediaLibraryModal.loading') || dynamicSearchActive && t('mediaLibrary.mediaLibraryModal.noResults') || !hasFiles && t('mediaLibrary.mediaLibraryModal.noAssetsFound') || !hasFilteredFiles && t('mediaLibrary.mediaLibraryModal.noImagesFound') || !hasSearchResults && t('mediaLibrary.mediaLibraryModal.noResults');
  const hasSelection = hasMedia && !isEmpty(selectedFile);
  return ___EmotionJSX(StyledModal, {
    isOpen: isVisible,
    onClose: handleClose,
    isPrivate: privateUpload
  }, ___EmotionJSX(MediaLibraryTop, {
    t: t,
    onClose: handleClose,
    privateUpload: privateUpload,
    forImage: forImage,
    onDownload: handleDownload,
    onUpload: handlePersist,
    query: query,
    onSearchChange: handleSearchChange,
    onSearchKeyDown: handleSearchKeyDown,
    searchDisabled: !dynamicSearchActive && !hasFilteredFiles,
    onDelete: handleDelete,
    canInsert: canInsert,
    onInsert: handleInsert,
    hasSelection: hasSelection,
    isPersisting: isPersisting,
    isDeleting: isDeleting,
    selectedFile: selectedFile,
    source: source,
    onChangeSource: onChangeSource,
    showLocalPreview: showLocalPreview,
    breadcrumbs: breadcrumbs,
    onNavigateUp: onNavigateUp,
    onNavigateBreadcrumb: onNavigateBreadcrumb
  }), !shouldShowEmptyMessage ? null : ___EmotionJSX(EmptyMessage, {
    content: emptyMessage,
    isPrivate: privateUpload
  }), ___EmotionJSX(MediaLibraryCardGrid, {
    setScrollContainerRef: setScrollContainerRef,
    mediaItems: tableData,
    isSelectedFile: file => selectedFile.key === file.key,
    onAssetClick: handleAssetClick,
    canLoadMore: hasNextPage,
    onLoadMore: handleLoadMore,
    isPaginating: isPaginating,
    paginatingMessage: t('mediaLibrary.mediaLibraryModal.loading'),
    cardDraftText: t('mediaLibrary.mediaLibraryCard.draft'),
    cardWidth: cardWidth,
    cardHeight: cardHeight,
    cardMargin: cardMargin,
    isPrivate: privateUpload,
    loadDisplayURL: loadDisplayURL,
    displayURLs: displayURLs
  }));
}
export const fileShape = {
  displayURL: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  id: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  queryOrder: PropTypes.number,
  size: PropTypes.number,
  path: PropTypes.string.isRequired
};
MediaLibraryModal.propTypes = {
  isVisible: PropTypes.bool,
  canInsert: PropTypes.bool,
  files: PropTypes.arrayOf(PropTypes.shape(fileShape)).isRequired,
  dynamicSearch: PropTypes.bool,
  dynamicSearchActive: PropTypes.bool,
  forImage: PropTypes.bool,
  isLoading: PropTypes.bool,
  isPersisting: PropTypes.bool,
  isDeleting: PropTypes.bool,
  hasNextPage: PropTypes.bool,
  isPaginating: PropTypes.bool,
  privateUpload: PropTypes.bool,
  query: PropTypes.string,
  selectedFile: PropTypes.oneOfType([PropTypes.shape(fileShape), PropTypes.shape({})]),
  handleFilter: PropTypes.func.isRequired,
  handleQuery: PropTypes.func.isRequired,
  toTableData: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  handleSearchKeyDown: PropTypes.func.isRequired,
  handlePersist: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleInsert: PropTypes.func.isRequired,
  setScrollContainerRef: PropTypes.func.isRequired,
  handleAssetClick: PropTypes.func.isRequired,
  handleLoadMore: PropTypes.func.isRequired,
  loadDisplayURL: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  displayURLs: PropTypes.instanceOf(Map).isRequired,
  source: PropTypes.oneOf(['repo', 'local_preview']),
  onChangeSource: PropTypes.func,
  showLocalPreview: PropTypes.bool,
  breadcrumbs: PropTypes.arrayOf(PropTypes.string),
  onNavigateUp: PropTypes.func,
  onNavigateBreadcrumb: PropTypes.func
};
export default translate()(MediaLibraryModal);