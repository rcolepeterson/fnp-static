import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
//import { withSmartKnobs } from 'storybook-addon-smart-knobs';

import Carousel from 'microzine-3.2/views/carousel/Carousel';
import CarouselButton from 'microzine-3.2/views/carousel/CarouselButton';
import EndCard from 'microzine-3.2/views/carousel/EndCard';
import Zumobivideovideojs from 'microzine-3.2/views/partials/video/Zumobivideovideojs';

const relatedVideos = [
  {
    img: 'https://www.fillmurray.com/g/640/360',
    desc:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    videoURL:
      '//lamberta.github.io/html5-animation/examples/ch04/assets/movieclip.mp4'
  },
  {
    img: 'http://via.placeholder.com/256x154',
    desc: 'Lorem ipsum dolor sit',
    videoURL:
      '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  }
];

const styleObj = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'darkred',
  color: 'white',
  height: '100%'
};
const slides = [
  {
    type: 'video-js',
    videoURL:
      '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    relatedVideos: [
      {
        img: 'https://www.fillmurray.com/g/640/360',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        videoURL:
          '//lamberta.github.io/html5-animation/examples/ch04/assets/movieclip.mp4'
      },
      {
        img: 'http://via.placeholder.com/640x360',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        videoURL:
          '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      }
    ]
  },
  {
    type: 'video-js',
    videoURL:
      '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    relatedVideos: [
      {
        img: 'http://via.placeholder.com/640x360',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        videoURL:
          '//lamberta.github.io/html5-animation/examples/ch04/assets/movieclip.mp4'
      },
      {
        img: 'https://www.fillmurray.com/g/640/360',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        videoURL:
          '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      }
    ]
  }
];

storiesOf('Carousel', module)
  //.addDecorator(withSmartKnobs)
  .addDecorator(withKnobs)
  .add(
    'Carousel',
    () => (
      <Carousel
        isDesktop={boolean('isDesktop', true)}
        showBrandHeader={boolean('brandHeader. (Must be on slide 2)', true)}
        topBorder={boolean('topBorder', true)}>
        <div style={styleObj}>
          <h1>COLE</h1>
        </div>
        <Zumobivideovideojs
          src={slides[0].videoURL}
          loop={'false'}
          autoplay={'false'}
          relatedVideos={slides[0].relatedVideos}
        />
        <div style={styleObj}>
          <h1>Wade</h1>
        </div>
        <div style={styleObj}>
          <h1>Vinaya</h1>
        </div>
        <Zumobivideovideojs
          src={slides[1].videoURL}
          loop={'false'}
          autoplay={'false'}
          relatedVideos={slides[1].relatedVideos}
        />
        <div style={styleObj}>
          <h1>Justin</h1>
        </div>
      </Carousel>
    ),
    {
      notes:
        'Must be on slide two to see brand header. Mobile does not have carousel buttons.'
    }
  )
  .add('CarouselButton', () => (
    <CarouselButton
      direction="left"
      direction={text('left or right', 'left')}
    />
  ))
  .add('EndCard', () => <EndCard relatedVideos={relatedVideos} />);
