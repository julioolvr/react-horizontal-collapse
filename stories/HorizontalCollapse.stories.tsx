import React from 'react';
import { HorizontalCollapse, Props } from '../src';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (props?: Partial<Props>) => (
  <div
    style={{
      width: '250px',
      resize: 'horizontal',
      overflow: 'scroll',
      border: '1px solid black',
      padding: '1em',
    }}
  >
    <HorizontalCollapse {...props} placeholderElement={<div>...</div>}>
      <div>Child1</div>
      <div>Child2</div>
      <div>Child3</div>
      <div>Child4</div>
      <div>Child5</div>
      <div>Child6</div>
      <div>Child7</div>
      <div>Child8</div>
      <div>Child9</div>
      <div>Child10</div>
    </HorizontalCollapse>
  </div>
);
