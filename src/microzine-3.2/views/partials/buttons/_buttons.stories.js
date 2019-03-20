import React from 'react';
import { storiesOf } from '@storybook/react';
import { withSmartKnobs } from 'storybook-addon-smart-knobs';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';

import Button from './Button';
import ArrowButton from './ArrowButton';
import CtaButton from './CtaButton';
import PromoButton from './PromoButton';

storiesOf('Buttons', module)
  .addDecorator(withSmartKnobs)
  .addDecorator(withKnobs)
  .add('Button', () => <Button>hey</Button>)
  .add('ArrowButton', () => <ArrowButton />)
  .add('CtaButton', () => <CtaButton arrow />)
  .add('PromoButton', () => <PromoButton icon="arrow">Hello</PromoButton>);
