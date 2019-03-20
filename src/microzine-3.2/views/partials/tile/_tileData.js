import Article from '../../../models/Article';

const articlesJSON = [
  {
    article_extras: {
      type: 'article',
      source: 'blog'
    },
    article_summary: '…I’m a naturally good shot.',
    article_collection_path: 'zumobi/starwars-3-1/1blog',
    article_collection_title: '1Blog',
    article_collection_name: '1blog',
    article_tags: ['Zumobi QA MZ Torture Test', 'naturally good shot', '…I'],
    article_published_at: '2018-09-19T20:35:16.000Z',
    article_updated_at: '2018-09-26T03:55:54.382Z',
    article_changed_at: '2018-09-19T20:35:16.000Z',
    article_author: 'CorningGorilla',
    article_image_url:
      'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_medium.jpg',
    article_image_details: {
      large: {
        name: '83dec26e69595591df31779a61966b20775fd9c2_large.jpg',
        content_type: 'image/gif',
        dimensions: '453x256',
        cached_filename:
          'imageservice/cache/83dec26e69595591df31779a61966b20775fd9c2/83dec26e69595591df31779a61966b20775fd9c2_resize_w750_q75.jpg',
        url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_large.jpg'
      },
      small: {
        name: '83dec26e69595591df31779a61966b20775fd9c2_small.jpg',
        content_type: 'image/gif',
        dimensions: '340x192',
        cached_filename:
          'imageservice/cache/83dec26e69595591df31779a61966b20775fd9c2/83dec26e69595591df31779a61966b20775fd9c2_resize_w340_q75.jpg',
        url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_small.jpg'
      },
      medium: {
        name: '83dec26e69595591df31779a61966b20775fd9c2_medium.jpg',
        content_type: 'image/gif',
        dimensions: '453x256',
        cached_filename:
          'imageservice/cache/83dec26e69595591df31779a61966b20775fd9c2/83dec26e69595591df31779a61966b20775fd9c2_resize_w570_q75.jpg',
        url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_medium.jpg'
      }
    },
    article_images: [
      {
        url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_medium.jpg',
        caption: null,
        title: 'That was easy…',
        large: {
          name: '83dec26e69595591df31779a61966b20775fd9c2_large.jpg',
          content_type: 'image/gif',
          dimensions: '453x256',
          cached_filename:
            'imageservice/cache/83dec26e69595591df31779a61966b20775fd9c2/83dec26e69595591df31779a61966b20775fd9c2_resize_w750_q75.jpg',
          url:
            'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_large.jpg'
        },
        small: {
          name: '83dec26e69595591df31779a61966b20775fd9c2_small.jpg',
          content_type: 'image/gif',
          dimensions: '340x192',
          cached_filename:
            'imageservice/cache/83dec26e69595591df31779a61966b20775fd9c2/83dec26e69595591df31779a61966b20775fd9c2_resize_w340_q75.jpg',
          url:
            'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_small.jpg'
        },
        medium: {
          name: '83dec26e69595591df31779a61966b20775fd9c2_medium.jpg',
          content_type: 'image/gif',
          dimensions: '453x256',
          cached_filename:
            'imageservice/cache/83dec26e69595591df31779a61966b20775fd9c2/83dec26e69595591df31779a61966b20775fd9c2_resize_w570_q75.jpg',
          url:
            'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/83dec26e69595591df31779a61966b20775fd9c2_medium.jpg'
        }
      }
    ],
    article_title: 'That was easy…',
    article_content: '<p></p><br><p>…I’m a naturally good shot.</p><br>',
    article_position: 0,
    article_related_products: [],
    article_related_articles: [
      {
        url: 'https://cms.zumobi.net/index.php/2018/06/07/broken-image-links/',
        digest: '9b1ddcfcb6eda7f75a1e27cd2ad73aafc38b51e2',
        clean_title: 'broken-image-links9b1ddcfcb6',
        article_title: 'Broken Image Links',
        summary: 'This is a broken image link.',
        thumbnail:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6bb362434ca0278ee163a35e73552ac0afe75761_small.jpg',
        image_url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6bb362434ca0278ee163a35e73552ac0afe75761_small.jpg'
      },
      {
        url:
          'https://cms.zumobi.net/index.php/2016/11/09/article-with-no-text/',
        digest: '92b1bd9c696319fea02c3e73678a7d8ec50734ca',
        clean_title: 'article-with-no-text92b1bd9c69',
        article_title: 'Article with no text',
        summary: '',
        thumbnail:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6048c2a3ac68470397c41c23b18a3d054f8faec5_small.jpg',
        image_url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6048c2a3ac68470397c41c23b18a3d054f8faec5_small.jpg'
      }
    ],
    article_clean_title: 'that-was-easybfb9598b92',
    article_url:
      'https://cms.zumobi.net/index.php/2018/09/19/sleestack-vs-skywalker/',
    article_digest: 'bfb9598b924c3803cb2f1db54ba123247a7bdcc6'
  },
  {
    article_extras: {
      type: 'article',
      source: 'blog'
    },
    article_summary:
      'Come and listen to my story about a man named Jed1  A poor mountaineer2, barely kept his family fed,  And then one day he was shootin at some food,  And up through the ground come a bubblin crude.  Oil that is, black gold, Texas tea3.  Well the first thing you know ol Jed’s a millionaire,  … <span class="link">Continue reading <span>Testing Underline and Bold Tags!</span></span>',
    article_collection_path: 'zumobi/starwars-3-1/1blog',
    article_collection_title: '1Blog',
    article_collection_name: '1blog',
    article_tags: [
      'Zumobi QA MZ Torture Test',
      'related_test',
      'bubblin crude. Oil',
      'ol Jed',
      'poor mountaineer',
      'Beverly Hills',
      'black gold',
      'Swimmin pools',
      'Texas tea.',
      'movie stars',
      'kinfolk'
    ],
    article_published_at: '2018-08-22T18:10:31.000Z',
    article_updated_at: '2018-09-26T03:55:54.482Z',
    article_changed_at: '2018-08-22T18:14:31.000Z',
    article_author: 'CorningGorilla',
    article_images: [],
    article_title: 'Testing Underline and Bold Tags!',
    article_content:
      '<p>Come and listen to my story about a man named <b>Jed</b><sub>1</sub> <br><br>A poor mountaineer<sup>2</sup>, barely kept his family <b>fed</b>, <br><br>And then one day he was shootin at some <u>food</u>, <br><br>And up through the ground come a <u>bubblin crude.</u> </p><br><p>Oil that is, <b>black gold, Texas tea<sup>3</sup>.</b> </p><br><p>Well the first thing you know ol Jed’s a <u>millionaire</u>, <br><br>The kinfolk said <i>“Jed move away from there”</i> <br><br>Said <i>“Californy is the place you ought to be”</i><br><br>So they loaded up the truck and they moved to <u>Beverly</u> </p><br><p>Hills, that is. Swimmin pools, movie stars. </p><br><p><b>1</b> Jed is a fictional character from the Beverly Hillbillys <br><br><b>2</b> Jed’s status as a real mountaineer is in doubt..needs citation <br><br><b>3</b> There is no historical fact of Texans actually drinking crude oil…needs citation </p><br>',
    article_position: 1,
    article_related_products: [],
    article_related_articles: [
      {
        url: 'https://cms.zumobi.net/index.php/2018/06/07/broken-image-links/',
        digest: '9b1ddcfcb6eda7f75a1e27cd2ad73aafc38b51e2',
        clean_title: 'broken-image-links9b1ddcfcb6',
        article_title: 'Broken Image Links',
        summary: 'This is a broken image link.',
        thumbnail:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6bb362434ca0278ee163a35e73552ac0afe75761_small.jpg',
        image_url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6bb362434ca0278ee163a35e73552ac0afe75761_small.jpg'
      },
      {
        url:
          'https://cms.zumobi.net/index.php/2016/11/09/article-with-no-text/',
        digest: '92b1bd9c696319fea02c3e73678a7d8ec50734ca',
        clean_title: 'article-with-no-text92b1bd9c69',
        article_title: 'Article with no text',
        summary: '',
        thumbnail:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6048c2a3ac68470397c41c23b18a3d054f8faec5_small.jpg',
        image_url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/6048c2a3ac68470397c41c23b18a3d054f8faec5_small.jpg'
      },
      {
        url: 'https://cms.zumobi.net/index.php/2016/11/09/tall-hero-image/',
        digest: 'e81f6d6f451b802bb2a7984cf42b7619e39a548d',
        clean_title: 'tall-hero-imagee81f6d6f45',
        article_title: 'Tall Hero Image',
        summary:
          'Pictured above…. a super tall image of an infographic showing the space needle. This is meant to be absurdly tall. Black circles at top and bottom of image are to visually verify whether any part of the image is being clipped or if the aspect ratio is being altered.  ',
        thumbnail:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/67fcdb0fabe66bd223b00107083c675168fadf6d_small.jpg',
        image_url:
          'http://staging.microsites.partnersite.mobi/zumobi/3-2/external_assets/67fcdb0fabe66bd223b00107083c675168fadf6d_small.jpg'
      }
    ],
    article_clean_title: 'testing-underline-and-bold-tags8d7137bd94',
    article_url:
      'https://cms.zumobi.net/index.php/2018/08/22/testing-underline-and-bold-tags/',
    article_digest: '8d7137bd949ee0bd1796655917e86d1f8f4b53f6'
  }
];

export let articles = articlesJSON.map(articleJSON => new Article(articleJSON));
