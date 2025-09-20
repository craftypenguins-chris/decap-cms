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
})("display:grid;grid-template-rows:120px auto;width:calc(", cardOutsideWidth, " + 20px);background-color:", props => props.isPrivate && colors.grayDark, ";@media (min-width: 800px){width:calc(", cardOutsideWidth, " * 2 + 20px);}@media (min-width: 1120px){width:calc(", cardOutsideWidth, " * 3 + 20px);}@media (min-width: 1440px){width:calc(", cardOutsideWidth, " * 4 + 20px);}@media (min-width: 1760px){width:calc(", cardOutsideWidth, " * 5 + 20px);}@media (min-width: 2080px){width:calc(", cardOutsideWidth, " * 6 + 20px);}h1{color:", props => props.isPrivate && colors.textFieldBorder, ";}button:disabled,label[disabled]{background-color:", props => props.isPrivate && `rgba(217, 217, 217, 0.15)`, ";}" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01lZGlhTGlicmFyeS9NZWRpYUxpYnJhcnlNb2RhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUEyQmlDIiwiZmlsZSI6Ii4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01lZGlhTGlicmFyeS9NZWRpYUxpYnJhcnlNb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHN0eWxlZCBmcm9tICdAZW1vdGlvbi9zdHlsZWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBpc0VtcHR5IGZyb20gJ2xvZGFzaC9pc0VtcHR5JztcbmltcG9ydCB7IHRyYW5zbGF0ZSB9IGZyb20gJ3JlYWN0LXBvbHlnbG90JztcbmltcG9ydCB7IGNvbG9ycyB9IGZyb20gJ2RlY2FwLWNtcy11aS1kZWZhdWx0JztcblxuaW1wb3J0IHsgTW9kYWwgfSBmcm9tICcuLi9VSSc7XG5pbXBvcnQgTWVkaWFMaWJyYXJ5VG9wIGZyb20gJy4vTWVkaWFMaWJyYXJ5VG9wJztcbmltcG9ydCBNZWRpYUxpYnJhcnlDYXJkR3JpZCBmcm9tICcuL01lZGlhTGlicmFyeUNhcmRHcmlkJztcbmltcG9ydCBFbXB0eU1lc3NhZ2UgZnJvbSAnLi9FbXB0eU1lc3NhZ2UnO1xuXG4vKipcbiAqIFJlc3BvbnNpdmUgc3R5bGluZyBuZWVkcyB0byBiZSBvdmVyaGF1bGVkLiBDdXJyZW50IHNldHVwIHJlcXVpcmVzIHNwZWNpZnlpbmdcbiAqIHdpZHRocyBwZXIgYnJlYWtwb2ludC5cbiAqL1xuY29uc3QgY2FyZFdpZHRoID0gYDI4MHB4YDtcbmNvbnN0IGNhcmRIZWlnaHQgPSBgMjQwcHhgO1xuY29uc3QgY2FyZE1hcmdpbiA9IGAxMHB4YDtcblxuLyoqXG4gKiBjYXJkV2lkdGggKyBjYXJkTWFyZ2luICogMiA9IGNhcmRPdXRzaWRlV2lkdGhcbiAqIChub3QgdXNpbmcgY2FsYyBiZWNhdXNlIHRoaXMgd2lsbCBiZSBuZXN0ZWQgaW4gb3RoZXIgY2FsY3MpXG4gKi9cbmNvbnN0IGNhcmRPdXRzaWRlV2lkdGggPSBgMzAwcHhgO1xuXG5jb25zdCBTdHlsZWRNb2RhbCA9IHN0eWxlZChNb2RhbClgXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogMTIwcHggYXV0bztcbiAgd2lkdGg6IGNhbGMoJHtjYXJkT3V0c2lkZVdpZHRofSArIDIwcHgpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAke3Byb3BzID0+IHByb3BzLmlzUHJpdmF0ZSAmJiBjb2xvcnMuZ3JheURhcmt9O1xuXG4gIEBtZWRpYSAobWluLXdpZHRoOiA4MDBweCkge1xuICAgIHdpZHRoOiBjYWxjKCR7Y2FyZE91dHNpZGVXaWR0aH0gKiAyICsgMjBweCk7XG4gIH1cblxuICBAbWVkaWEgKG1pbi13aWR0aDogMTEyMHB4KSB7XG4gICAgd2lkdGg6IGNhbGMoJHtjYXJkT3V0c2lkZVdpZHRofSAqIDMgKyAyMHB4KTtcbiAgfVxuXG4gIEBtZWRpYSAobWluLXdpZHRoOiAxNDQwcHgpIHtcbiAgICB3aWR0aDogY2FsYygke2NhcmRPdXRzaWRlV2lkdGh9ICogNCArIDIwcHgpO1xuICB9XG5cbiAgQG1lZGlhIChtaW4td2lkdGg6IDE3NjBweCkge1xuICAgIHdpZHRoOiBjYWxjKCR7Y2FyZE91dHNpZGVXaWR0aH0gKiA1ICsgMjBweCk7XG4gIH1cblxuICBAbWVkaWEgKG1pbi13aWR0aDogMjA4MHB4KSB7XG4gICAgd2lkdGg6IGNhbGMoJHtjYXJkT3V0c2lkZVdpZHRofSAqIDYgKyAyMHB4KTtcbiAgfVxuXG4gIGgxIHtcbiAgICBjb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5pc1ByaXZhdGUgJiYgY29sb3JzLnRleHRGaWVsZEJvcmRlcn07XG4gIH1cblxuICBidXR0b246ZGlzYWJsZWQsXG4gIGxhYmVsW2Rpc2FibGVkXSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHtwcm9wcyA9PiBwcm9wcy5pc1ByaXZhdGUgJiYgYHJnYmEoMjE3LCAyMTcsIDIxNywgMC4xNSlgfTtcbiAgfVxuYDtcblxuZnVuY3Rpb24gTWVkaWFMaWJyYXJ5TW9kYWwoe1xuICBpc1Zpc2libGUsXG4gIGNhbkluc2VydCxcbiAgZmlsZXMsXG4gIGR5bmFtaWNTZWFyY2gsXG4gIGR5bmFtaWNTZWFyY2hBY3RpdmUsXG4gIGZvckltYWdlLFxuICBpc0xvYWRpbmcsXG4gIGlzUGVyc2lzdGluZyxcbiAgaXNEZWxldGluZyxcbiAgaGFzTmV4dFBhZ2UsXG4gIGlzUGFnaW5hdGluZyxcbiAgcHJpdmF0ZVVwbG9hZCxcbiAgcXVlcnksXG4gIHNlbGVjdGVkRmlsZSxcbiAgaGFuZGxlRmlsdGVyLFxuICBoYW5kbGVRdWVyeSxcbiAgdG9UYWJsZURhdGEsXG4gIGhhbmRsZUNsb3NlLFxuICBoYW5kbGVTZWFyY2hDaGFuZ2UsXG4gIGhhbmRsZVNlYXJjaEtleURvd24sXG4gIGhhbmRsZVBlcnNpc3QsXG4gIGhhbmRsZURlbGV0ZSxcbiAgaGFuZGxlSW5zZXJ0LFxuICBoYW5kbGVEb3dubG9hZCxcbiAgc2V0U2Nyb2xsQ29udGFpbmVyUmVmLFxuICBoYW5kbGVBc3NldENsaWNrLFxuICBoYW5kbGVMb2FkTW9yZSxcbiAgbG9hZERpc3BsYXlVUkwsXG4gIGRpc3BsYXlVUkxzLFxuICB0LFxuICBzb3VyY2UsXG4gIG9uQ2hhbmdlU291cmNlLFxuICBzaG93TG9jYWxQcmV2aWV3LFxuICBicmVhZGNydW1icyxcbiAgb25OYXZpZ2F0ZVVwLFxuICBvbk5hdmlnYXRlQnJlYWRjcnVtYixcbiAgaXNMb2NhbFByZXZpZXcsXG4gIGZvbGRlcnMgPSBbXSxcbiAgb25Gb2xkZXJDbGljayxcbn0pIHtcbiAgY29uc3QgZmlsdGVyZWRGaWxlcyA9IGZvckltYWdlID8gaGFuZGxlRmlsdGVyKGZpbGVzKSA6IGZpbGVzO1xuICBjb25zdCBxdWVyaWVkRmlsZXMgPSAhZHluYW1pY1NlYXJjaCAmJiBxdWVyeSA/IGhhbmRsZVF1ZXJ5KHF1ZXJ5LCBmaWx0ZXJlZEZpbGVzKSA6IGZpbHRlcmVkRmlsZXM7XG4gIGNvbnN0IHRhYmxlRGF0YSA9IHRvVGFibGVEYXRhKHF1ZXJpZWRGaWxlcyk7XG4gIGNvbnN0IGhhc0ZpbGVzID0gZmlsZXMgJiYgISFmaWxlcy5sZW5ndGg7XG4gIGNvbnN0IGhhc0ZpbHRlcmVkRmlsZXMgPSBmaWx0ZXJlZEZpbGVzICYmICEhZmlsdGVyZWRGaWxlcy5sZW5ndGg7XG4gIGNvbnN0IGhhc1NlYXJjaFJlc3VsdHMgPSBxdWVyaWVkRmlsZXMgJiYgISFxdWVyaWVkRmlsZXMubGVuZ3RoO1xuICBjb25zdCBoYXNNZWRpYSA9IGhhc1NlYXJjaFJlc3VsdHM7XG4gIGNvbnN0IHNob3VsZFNob3dFbXB0eU1lc3NhZ2UgPSAhaGFzTWVkaWE7XG4gIGNvbnN0IGVtcHR5TWVzc2FnZSA9XG4gICAgKGlzTG9hZGluZyAmJiAhaGFzTWVkaWEgJiYgdCgnbWVkaWFMaWJyYXJ5Lm1lZGlhTGlicmFyeU1vZGFsLmxvYWRpbmcnKSkgfHxcbiAgICAoZHluYW1pY1NlYXJjaEFjdGl2ZSAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9SZXN1bHRzJykpIHx8XG4gICAgKCFoYXNGaWxlcyAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9Bc3NldHNGb3VuZCcpKSB8fFxuICAgICghaGFzRmlsdGVyZWRGaWxlcyAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9JbWFnZXNGb3VuZCcpKSB8fFxuICAgICghaGFzU2VhcmNoUmVzdWx0cyAmJiB0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5TW9kYWwubm9SZXN1bHRzJykpO1xuXG4gIGNvbnN0IGhhc1NlbGVjdGlvbiA9IGhhc01lZGlhICYmICFpc0VtcHR5KHNlbGVjdGVkRmlsZSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U3R5bGVkTW9kYWwgaXNPcGVuPXtpc1Zpc2libGV9IG9uQ2xvc2U9e2hhbmRsZUNsb3NlfSBpc1ByaXZhdGU9e3ByaXZhdGVVcGxvYWR9PlxuICAgICAgPE1lZGlhTGlicmFyeVRvcFxuICAgICAgICB0PXt0fVxuICAgICAgICBvbkNsb3NlPXtoYW5kbGVDbG9zZX1cbiAgICAgICAgcHJpdmF0ZVVwbG9hZD17cHJpdmF0ZVVwbG9hZH1cbiAgICAgICAgZm9ySW1hZ2U9e2ZvckltYWdlfVxuICAgICAgICBvbkRvd25sb2FkPXtoYW5kbGVEb3dubG9hZH1cbiAgICAgICAgb25VcGxvYWQ9e2hhbmRsZVBlcnNpc3R9XG4gICAgICAgIHF1ZXJ5PXtxdWVyeX1cbiAgICAgICAgb25TZWFyY2hDaGFuZ2U9e2hhbmRsZVNlYXJjaENoYW5nZX1cbiAgICAgICAgb25TZWFyY2hLZXlEb3duPXtoYW5kbGVTZWFyY2hLZXlEb3dufVxuICAgICAgICBzZWFyY2hEaXNhYmxlZD17IWR5bmFtaWNTZWFyY2hBY3RpdmUgJiYgIWhhc0ZpbHRlcmVkRmlsZXN9XG4gICAgICAgIG9uRGVsZXRlPXtoYW5kbGVEZWxldGV9XG4gICAgICAgIGNhbkluc2VydD17Y2FuSW5zZXJ0fVxuICAgICAgICBvbkluc2VydD17aGFuZGxlSW5zZXJ0fVxuICAgICAgICBoYXNTZWxlY3Rpb249e2hhc1NlbGVjdGlvbn1cbiAgICAgICAgaXNQZXJzaXN0aW5nPXtpc1BlcnNpc3Rpbmd9XG4gICAgICAgIGlzRGVsZXRpbmc9e2lzRGVsZXRpbmd9XG4gICAgICAgIHNlbGVjdGVkRmlsZT17c2VsZWN0ZWRGaWxlfVxuICAgICAgICBzb3VyY2U9e3NvdXJjZX1cbiAgICAgICAgb25DaGFuZ2VTb3VyY2U9e29uQ2hhbmdlU291cmNlfVxuICAgICAgICBzaG93TG9jYWxQcmV2aWV3PXtzaG93TG9jYWxQcmV2aWV3fVxuICAgICAgICBicmVhZGNydW1icz17YnJlYWRjcnVtYnN9XG4gICAgICAgIG9uTmF2aWdhdGVVcD17b25OYXZpZ2F0ZVVwfVxuICAgICAgICBvbk5hdmlnYXRlQnJlYWRjcnVtYj17b25OYXZpZ2F0ZUJyZWFkY3J1bWJ9XG4gICAgICAvPlxuICAgICAgeyFzaG91bGRTaG93RW1wdHlNZXNzYWdlID8gbnVsbCA6IChcbiAgICAgICAgPEVtcHR5TWVzc2FnZSBjb250ZW50PXtlbXB0eU1lc3NhZ2V9IGlzUHJpdmF0ZT17cHJpdmF0ZVVwbG9hZH0gLz5cbiAgICAgICl9XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAxNiB9fT5cbiAgICAgICAge2lzTG9jYWxQcmV2aWV3ID8gKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDI0MCwgbWluV2lkdGg6IDI0MCB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiA4LCBmb250V2VpZ2h0OiA2MDAgfX0+Rm9sZGVyczwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDggfX0+XG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e29uTmF2aWdhdGVVcH0+VXA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDggfX0+XG4gICAgICAgICAgICAgIDxzcGFuPi88L3NwYW4+XG4gICAgICAgICAgICAgIHticmVhZGNydW1icy5tYXAoKHNlZywgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgPHNwYW4ga2V5PXtpZHh9PlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4gb25OYXZpZ2F0ZUJyZWFkY3J1bWIoaWR4KX0gc3R5bGU9e3sgYmFja2dyb3VuZDogJ25vbmUnLCBib3JkZXI6ICdub25lJywgY29sb3I6ICcjMjU2M2ViJywgY3Vyc29yOiAncG9pbnRlcicgfX0+e3NlZ308L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIHtpZHggPCBicmVhZGNydW1icy5sZW5ndGggLSAxID8gJyAvICcgOiAnJ31cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1heEhlaWdodDogNDAwLCBvdmVyZmxvd1k6ICdhdXRvJywgYm9yZGVyOiAnMXB4IHNvbGlkICNlZWUnLCBib3JkZXJSYWRpdXM6IDQgfX0+XG4gICAgICAgICAgICAgIHtmb2xkZXJzLm1hcCgobmFtZSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfT5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IG9uRm9sZGVyQ2xpY2sobmFtZSl9IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIHRleHRBbGlnbjogJ2xlZnQnLCBwYWRkaW5nOiAnNnB4IDhweCcsIGJhY2tncm91bmQ6ICd3aGl0ZScsIGJvcmRlcjogJ25vbmUnLCBjdXJzb3I6ICdwb2ludGVyJyB9fT7wn5OBIHtuYW1lfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAge2ZvbGRlcnMubGVuZ3RoID09PSAwID8gPGRpdiBzdHlsZT17eyBwYWRkaW5nOiA4LCBjb2xvcjogJyM3NzcnIH19PihubyBmb2xkZXJzKTwvZGl2PiA6IG51bGx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cbiAgICAgICAgICA8TWVkaWFMaWJyYXJ5Q2FyZEdyaWRcbiAgICAgICAgICAgIHNldFNjcm9sbENvbnRhaW5lclJlZj17c2V0U2Nyb2xsQ29udGFpbmVyUmVmfVxuICAgICAgICAgICAgbWVkaWFJdGVtcz17dGFibGVEYXRhfVxuICAgICAgICAgICAgaXNTZWxlY3RlZEZpbGU9e2ZpbGUgPT4gc2VsZWN0ZWRGaWxlLmtleSA9PT0gZmlsZS5rZXl9XG4gICAgICAgICAgICBvbkFzc2V0Q2xpY2s9e2hhbmRsZUFzc2V0Q2xpY2t9XG4gICAgICAgICAgICBjYW5Mb2FkTW9yZT17aGFzTmV4dFBhZ2V9XG4gICAgICAgICAgICBvbkxvYWRNb3JlPXtoYW5kbGVMb2FkTW9yZX1cbiAgICAgICAgICAgIGlzUGFnaW5hdGluZz17aXNQYWdpbmF0aW5nfVxuICAgICAgICAgICAgcGFnaW5hdGluZ01lc3NhZ2U9e3QoJ21lZGlhTGlicmFyeS5tZWRpYUxpYnJhcnlNb2RhbC5sb2FkaW5nJyl9XG4gICAgICAgICAgICBjYXJkRHJhZnRUZXh0PXt0KCdtZWRpYUxpYnJhcnkubWVkaWFMaWJyYXJ5Q2FyZC5kcmFmdCcpfVxuICAgICAgICAgICAgY2FyZFdpZHRoPXtjYXJkV2lkdGh9XG4gICAgICAgICAgICBjYXJkSGVpZ2h0PXtjYXJkSGVpZ2h0fVxuICAgICAgICAgICAgY2FyZE1hcmdpbj17Y2FyZE1hcmdpbn1cbiAgICAgICAgICAgIGlzUHJpdmF0ZT17cHJpdmF0ZVVwbG9hZH1cbiAgICAgICAgICAgIGxvYWREaXNwbGF5VVJMPXtsb2FkRGlzcGxheVVSTH1cbiAgICAgICAgICAgIGRpc3BsYXlVUkxzPXtkaXNwbGF5VVJMc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvU3R5bGVkTW9kYWw+XG4gICk7XG59XG5cbmV4cG9ydCBjb25zdCBmaWxlU2hhcGUgPSB7XG4gIGRpc3BsYXlVUkw6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5vYmplY3RdKS5pc1JlcXVpcmVkLFxuICBpZDogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBrZXk6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgbmFtZTogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBxdWVyeU9yZGVyOiBQcm9wVHlwZXMubnVtYmVyLFxuICBzaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuICBwYXRoOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG59O1xuXG5NZWRpYUxpYnJhcnlNb2RhbC5wcm9wVHlwZXMgPSB7XG4gIGlzVmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gIGNhbkluc2VydDogUHJvcFR5cGVzLmJvb2wsXG4gIGZpbGVzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoZmlsZVNoYXBlKSkuaXNSZXF1aXJlZCxcbiAgZHluYW1pY1NlYXJjaDogUHJvcFR5cGVzLmJvb2wsXG4gIGR5bmFtaWNTZWFyY2hBY3RpdmU6IFByb3BUeXBlcy5ib29sLFxuICBmb3JJbWFnZTogUHJvcFR5cGVzLmJvb2wsXG4gIGlzTG9hZGluZzogUHJvcFR5cGVzLmJvb2wsXG4gIGlzUGVyc2lzdGluZzogUHJvcFR5cGVzLmJvb2wsXG4gIGlzRGVsZXRpbmc6IFByb3BUeXBlcy5ib29sLFxuICBoYXNOZXh0UGFnZTogUHJvcFR5cGVzLmJvb2wsXG4gIGlzUGFnaW5hdGluZzogUHJvcFR5cGVzLmJvb2wsXG4gIHByaXZhdGVVcGxvYWQ6IFByb3BUeXBlcy5ib29sLFxuICBxdWVyeTogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2VsZWN0ZWRGaWxlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc2hhcGUoZmlsZVNoYXBlKSwgUHJvcFR5cGVzLnNoYXBlKHt9KV0pLFxuICBoYW5kbGVGaWx0ZXI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGhhbmRsZVF1ZXJ5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB0b1RhYmxlRGF0YTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGhhbmRsZVNlYXJjaENoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlU2VhcmNoS2V5RG93bjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlUGVyc2lzdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlRGVsZXRlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBoYW5kbGVJbnNlcnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHNldFNjcm9sbENvbnRhaW5lclJlZjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlQXNzZXRDbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgaGFuZGxlTG9hZE1vcmU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGxvYWREaXNwbGF5VVJMOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBkaXNwbGF5VVJMczogUHJvcFR5cGVzLmluc3RhbmNlT2YoTWFwKS5pc1JlcXVpcmVkLFxuICBzb3VyY2U6IFByb3BUeXBlcy5vbmVPZihbJ3JlcG8nLCAnbG9jYWxfcHJldmlldyddKSxcbiAgb25DaGFuZ2VTb3VyY2U6IFByb3BUeXBlcy5mdW5jLFxuICBzaG93TG9jYWxQcmV2aWV3OiBQcm9wVHlwZXMuYm9vbCxcbiAgYnJlYWRjcnVtYnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICBvbk5hdmlnYXRlVXA6IFByb3BUeXBlcy5mdW5jLFxuICBvbk5hdmlnYXRlQnJlYWRjcnVtYjogUHJvcFR5cGVzLmZ1bmMsXG4gIGlzTG9jYWxQcmV2aWV3OiBQcm9wVHlwZXMuYm9vbCxcbiAgZm9sZGVyczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnN0cmluZyksXG4gIG9uRm9sZGVyQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdHJhbnNsYXRlKCkoTWVkaWFMaWJyYXJ5TW9kYWwpO1xuIl19 */"));
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
  onNavigateBreadcrumb,
  isLocalPreview,
  folders = [],
  onFolderClick
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
  }), ___EmotionJSX("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, isLocalPreview ? ___EmotionJSX("div", {
    style: {
      width: 240,
      minWidth: 240
    }
  }, ___EmotionJSX("div", {
    style: {
      marginBottom: 8,
      fontWeight: 600
    }
  }, "Folders"), ___EmotionJSX("div", {
    style: {
      marginBottom: 8
    }
  }, ___EmotionJSX("button", {
    type: "button",
    onClick: onNavigateUp
  }, "Up")), ___EmotionJSX("div", {
    style: {
      marginBottom: 8
    }
  }, ___EmotionJSX("span", null, "/"), breadcrumbs.map((seg, idx) => ___EmotionJSX("span", {
    key: idx
  }, ___EmotionJSX("button", {
    type: "button",
    onClick: () => onNavigateBreadcrumb(idx),
    style: {
      background: 'none',
      border: 'none',
      color: '#2563eb',
      cursor: 'pointer'
    }
  }, seg), idx < breadcrumbs.length - 1 ? ' / ' : ''))), ___EmotionJSX("div", {
    style: {
      maxHeight: 400,
      overflowY: 'auto',
      border: '1px solid #eee',
      borderRadius: 4
    }
  }, folders.map((name, i) => ___EmotionJSX("div", {
    key: i
  }, ___EmotionJSX("button", {
    type: "button",
    onClick: () => onFolderClick(name),
    style: {
      width: '100%',
      textAlign: 'left',
      padding: '6px 8px',
      background: 'white',
      border: 'none',
      cursor: 'pointer'
    }
  }, "\uD83D\uDCC1 ", name))), folders.length === 0 ? ___EmotionJSX("div", {
    style: {
      padding: 8,
      color: '#777'
    }
  }, "(no folders)") : null)) : null, ___EmotionJSX("div", {
    style: {
      flex: 1
    }
  }, ___EmotionJSX(MediaLibraryCardGrid, {
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
  }))));
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
  onNavigateBreadcrumb: PropTypes.func,
  isLocalPreview: PropTypes.bool,
  folders: PropTypes.arrayOf(PropTypes.string),
  onFolderClick: PropTypes.func
};
export default translate()(MediaLibraryModal);