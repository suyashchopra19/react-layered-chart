import React from 'react';
import PureRender from 'pure-render-decorator';
import _ from 'lodash';

import SelectFromStore from './mixins/SelectFromStore';
import MetadataDrivenDataLayer from './layers/MetadataDrivenDataLayer';
import BrushLayer from './layers/BrushLayer';
import InteractionCaptureLayer from './layers/InteractionCaptureLayer';
import HoverLayer from './layers/HoverLayer';
import Stack from './Stack';

import ActionType from './flux/ActionType';
import InteractionActions from './flux/InteractionActions';

import YAxis from './axes/YAxis';
import XAxis from './axes/XAxis';

import { shallowMemoize } from './util';

@PureRender
@SelectFromStore
class DefaultChart extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  };

  static selectFromStore = {
    seriesIds: 'seriesIds',
    xAxis: 'xAxis',
    seriesYAxisById: 'seriesYAxisById',
    selection: 'selection',
    hover: 'hover'
  };

  render() {
    return (
      <div className='default-chart'>
        <Stack className='chart-body'>
          <MetadataDrivenDataLayer
            store={this.props.store}
            seriesIds={this.state.seriesIds}
          />
          <BrushLayer
            xDomain={this.state.xAxis}
            selection={this.state.selection}
          />
          <InteractionCaptureLayer
            xDomain={this.state.xAxis}
            onHover={this._onHover}
            onPan={this._onPan}
            onZoom={this._onZoom}
            onBrush={this._onBrush}
          />
          <HoverLayer
            xDomain={this.state.xAxis}
            hover={this.state.hover}
          />
          <YAxis
            yDomains={this._getYDomains(this.state.seriesYAxisById, this.state.seriesIds)}
          />
        </Stack>
        <Stack className='time-axis'>
          <XAxis
            xDomain={this.state.xAxis}
          />
        </Stack>
      </div>
    );
  }

  _getYDomains = shallowMemoize(function(seriesYAxisById, seriesIds) {
    return _.values(_.pick(seriesYAxisById, seriesIds));
  });

  _onHover = (xPos) => {
    this.props.store.dispatch(InteractionActions.hover(xPos));
  };

  _onPan = (deltaX) => {
    this.props.store.dispatch(InteractionActions.pan(deltaX));
  };

  _onZoom = (factor, focus) => {
    this.props.store.dispatch(InteractionActions.zoom(factor, focus));
  };

  _onBrush = (brush) => {
    this.props.store.dispatch(InteractionActions.brush(brush));
  };
}

export default DefaultChart;
