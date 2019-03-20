import Article from '../../../models/Article';

const articlesJSON = [
  {
    article_extras: {
      url: 'https://www.zumobi.com/',
      type: 'article',
      price: '',
      source: 'promo'
    },
    article_summary:
      'Sign up here to receive breaking news about Star Wars as it happens!',
    article_collection_path: 'zumobi/starwars-3-2/1promo',
    article_collection_title: '1Promo',
    article_collection_name: '1promo',
    article_tags: ['Star Wars - Signup Card'],
    article_published_at: '2016-11-23T19:20:14.000Z',
    article_updated_at: '2018-05-30T16:57:37.007Z',
    article_changed_at: '2016-11-23T19:20:14.000Z',
    article_video_url: null,
    article_author: 'Zumobi',
    article_image_url:
      'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_medium.jpg',
    article_image_details: {
      large: {
        name: '6b536df1a0baf6e299f9fcd892a651254e0d01f6_large.jpg',
        content_type: 'image/jpeg',
        dimensions: '750x375',
        cached_filename:
          'imageservice/cache/6b536df1a0baf6e299f9fcd892a651254e0d01f6/6b536df1a0baf6e299f9fcd892a651254e0d01f6_resize_w750_q75.jpg',
        url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_large.jpg'
      },
      small: {
        name: '6b536df1a0baf6e299f9fcd892a651254e0d01f6_small.jpg',
        content_type: 'image/jpeg',
        dimensions: '340x170',
        cached_filename:
          'imageservice/cache/6b536df1a0baf6e299f9fcd892a651254e0d01f6/6b536df1a0baf6e299f9fcd892a651254e0d01f6_resize_w340_q75.jpg',
        url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_small.jpg'
      },
      medium: {
        name: '6b536df1a0baf6e299f9fcd892a651254e0d01f6_medium.jpg',
        content_type: 'image/jpeg',
        dimensions: '570x285',
        cached_filename:
          'imageservice/cache/6b536df1a0baf6e299f9fcd892a651254e0d01f6/6b536df1a0baf6e299f9fcd892a651254e0d01f6_resize_w570_q75.jpg',
        url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_medium.jpg'
      }
    },
    article_images: [
      {
        url:
          '/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_medium.jpg',
        caption: null,
        title: 'Sign Up For Star Wars Breaking News!',
        large: {
          name: '6b536df1a0baf6e299f9fcd892a651254e0d01f6_large.jpg',
          content_type: 'image/jpeg',
          dimensions: '750x375',
          cached_filename:
            'imageservice/cache/6b536df1a0baf6e299f9fcd892a651254e0d01f6/6b536df1a0baf6e299f9fcd892a651254e0d01f6_resize_w750_q75.jpg',
          url:
            'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_large.jpg'
        },
        small: {
          name: '6b536df1a0baf6e299f9fcd892a651254e0d01f6_small.jpg',
          content_type: 'image/jpeg',
          dimensions: '340x170',
          cached_filename:
            'imageservice/cache/6b536df1a0baf6e299f9fcd892a651254e0d01f6/6b536df1a0baf6e299f9fcd892a651254e0d01f6_resize_w340_q75.jpg',
          url:
            'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_small.jpg'
        },
        medium: {
          name: '6b536df1a0baf6e299f9fcd892a651254e0d01f6_medium.jpg',
          content_type: 'image/jpeg',
          dimensions: '570x285',
          cached_filename:
            'imageservice/cache/6b536df1a0baf6e299f9fcd892a651254e0d01f6/6b536df1a0baf6e299f9fcd892a651254e0d01f6_resize_w570_q75.jpg',
          url:
            'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6b536df1a0baf6e299f9fcd892a651254e0d01f6_medium.jpg'
        }
      }
    ],
    article_title: 'Sign Up For Star Wars Breaking News!',
    article_content:
      '<p><a href="https://www.zumobi.com/" target="_blank"></a></p>\n<p>Sign up here to receive breaking news about Star Wars as it happens!</p>\n',
    article_position: 0,
    article_related_products: [],
    article_related_articles: [],
    article_clean_title: 'sign-up-for-star-wars-breaking-news97153f975d',
    article_url:
      'https://cms.zumobi.net/index.php/2016/11/23/sign-up-for-star-wars-breaking-news/',
    article_digest: '97153f975de60300bec5ffd3ff53e4b64d7579bd'
  }
];
export let promos = articlesJSON.map(articleJSON => new Article(articleJSON));
