import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as HorizontalCollapse } from '../stories/HorizontalCollapse.stories';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<HorizontalCollapse />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
