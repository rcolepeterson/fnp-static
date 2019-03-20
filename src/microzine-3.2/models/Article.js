import Properties from 'microzine-3.2/helpers/MicrozineProperties';
import { dateDiff, getDateFormatted } from 'microzine-3.2/helpers/utils';
//import Moment from 'moment';
/**
 * Article model
 */
class Article {
  /**
   * Creates a new instance of an Article from the given data
   *
   * @param {Object} data - Object containing data to create the model
   */
  constructor(data) {
    this._data = data;
    this.offsetTop = 0;
    this.marginTop = 10;
    this.textHeight = 0;
    this.tileHeight = 0;
    Object.getOwnPropertyNames(data).forEach(k => (this[k] = data[k]));
  }

  /**
   * Formula to find the normalized title for an Article
   *
   * @returns {string}  - The normalized title
   * @private
   */
  _chooseTitle() {
    let source = this.source;

    if (
      source === 'twitter' ||
      source === 'pinterest' ||
      source === 'facebook' ||
      source === 'instagram'
    ) {
      return this._data.article_summary || this._data.article_content;
    } else {
      return this._data.article_title;
    }
  }

  /**
   * Formula to find the normalized article title for an Article
   *
   * @returns {string}  - The normalized title
   * @private
   */
  _chooseArticleTitle() {
    let source = this.source;
    switch (source) {
      case 'blog':
        return this._data.article_title;
      case 'twitter':
        return this._data.article_extras.name;
      case 'pinterest':
        return this._data.article_author;
      case 'facebook':
        return this._data.article_author;
      case 'instagram':
        return this._data.article_author;
      case 'youtube':
        return this._data.article_extras.channel_title;
    }
  }

  /**
   * Formula to find the normalized  title for a tile
   *
   * @returns {string}  - The normalized title
   * @private
   */
  _chooseTileTitle() {
    let source = this.source;
    switch (source) {
      case 'blog':
        let collection = Properties.collections.find(source => {
          return source.collectionType === 'blog';
        });
        // if there isn't a collection related (this is a sub collection in a collection) the mapping file will use the 'title' (sibling of 'name')
        if (!collection) {
          return this._data.article_collection_title;
        }
        return collection.title || collection.name || collection.collection;
      case 'twitter':
        return this._data.article_extras.name;
      case 'pinterest':
        return this._data.article_author;
      case 'facebook':
        return this._data.article_author;
      case 'instagram':
        return this._data.article_author;
      case 'youtube':
        return this._data.article_extras.channel_title;
      default:
        return this._data.article_collection_title;
    }
  }

  /**
   * Formula to find the normalized article sub title for an Article
   *
   * @returns {string}  - The normalized article subtitle
   * @private
   */
  _chooseArticleSubTitle() {
    let source = this.source;
    if (source === 'youtube') {
      return this._data.article_title;
    } else {
      return '';
    }
  }

  /**
   * Formula to find the normalized information for the left info panel for an Article
   *
   * @returns {string}  - The normalized left info
   * @private
   */
  _chooseLeftInfo() {
    let source = this.source;

    switch (source) {
      case 'blog':
        return Properties.getCollectionData(source).title;
      case 'twitter':
        return '';
      case 'pinterest':
        return '';
      case 'facebook':
        return (
          parseInt(this._data.article_extras.likes_count).toLocaleString() +
          ' Likes'
        );
      case 'instagram':
        return (
          parseInt(this._data.article_extras.likes_count).toLocaleString() +
          ' Likes'
        );
      case 'youtube':
        return (
          parseInt(this._data.article_extras.view_count).toLocaleString() +
          ' Views'
        );
    }
  }

  /**
   * Formula to find the normalized information for the right info panel for an Article
   *
   * @returns {string}  - The normalized right info
   * @private
   */
  _chooseRightInfo() {
    let source = this.source;

    switch (source) {
      case 'blog':
        return getDateFormatted(
          this._data.article_published_at,
          'MMMM D, YYYY'
        );
      //return Moment(this._data.article_published_at).utc().format('MMMM D, YYYY');
      case 'twitter':
        return '';
      case 'pinterest':
        return '';
      case 'facebook':
        return (
          parseInt(this._data.article_extras.shares_count).toLocaleString() +
          ' Shares'
        );
      case 'instagram':
        return dateDiff(this._data.article_published_at);
      //return Moment(this._data.article_published_at).utc().fromNow();
      case 'youtube':
        return Properties.getCollectionData(source).title;
    }
  }

  /**
   * Formula to find the normalized icon for an Article
   *
   * @returns {string}  - The normalized icon
   * @private
   */
  _chooseIcon() {
    let source = this.source;
    if (
      source === 'twitter' ||
      source === 'facebook' ||
      source === 'youtube' ||
      source === 'instagram'
    ) {
      return this.source + '.svg';
    } else if (source === 're' || source === 'ap' || source === 'pinterest') {
      return `${source}_icon.png`;
    } else {
      return 'rss.svg';
    }
  }

  /**
   * Formula to find the normalized tile data for an Article
   *
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Normalized tile data
   * @private
   */
  _chooseTileImage() {
    if (!this._data.article_image_details) {
      return null;
    }

    let imageObj = this._data.article_image_details.small;
    if (!imageObj) {
      imageObj = this._data.article_image_details.medium;
    }
    if (!imageObj) {
      imageObj = this._data.article_image_details.large;
    }

    if (!imageObj || !imageObj.dimensions || !imageObj.url) {
      return null;
    }

    return {
      contentType: imageObj.content_type,
      dimensions: imageObj.dimensions,
      name: imageObj.name,
      url: imageObj.url
    };
  }

  /**
   * Formula to find the normalized tile data for an Article
   *
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Normalized tile data
   * @private
   */
  _chooseArticleImage() {
    if (!this._data.article_image_details) {
      return null;
    }

    let imageObj = this._data.article_image_details.medium;
    if (!imageObj) {
      imageObj = this._data.article_image_details.large;
    }
    if (!imageObj) {
      imageObj = this._data.article_image_details.small;
    }

    if (!imageObj || !imageObj.dimensions || !imageObj.url) {
      return null;
    }

    return {
      contentType: imageObj.content_type,
      dimensions: imageObj.dimensions,
      name: imageObj.name,
      url: imageObj.url
    };
  }

  /**
   * Formula to find the normalized HippoGIF data for an Article
   *
   * @param {string} format                                                           - One of `'gif'`, `'mp4'`
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Normalized HippoGIF data
   * @private
   */
  _chooseHippoGIFPreview(format) {
    if (
      !this._data.article_image_details ||
      !this._data.article_image_details[format]
    ) {
      return {};
    }

    let preview = this._data.article_image_details[format];

    return {
      contentType: preview.content_type,
      dimensions: preview.dimensions,
      name: preview.name,
      url: preview.url
    };
  }

  /**
   * Gets data for a default 1x1 transparent PNG
   *
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Default 1x1 transparent PNG data object
   */
  get defaultTileImage() {
    return {
      contentType: 'image/png',
      dimensions: '0x0',
      name: '1x1transparent.png',
      url:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      isDefault: true
    };
  }

  /**
   * Gets the source of an Article
   *
   * @returns {string}  - The article source as provided by the fixture
   */
  get source() {
    let str = this.collectionName.toLowerCase();

    if (str.indexOf('blog') !== -1) {
      return 'blog';
    }
    if (str.indexOf('twitter') !== -1) {
      return 'twitter';
    }
    if (str.indexOf('pinterest') !== -1) {
      return 'pinterest';
    }
    if (str.indexOf('facebook') !== -1) {
      return 'facebook';
    }
    if (str.indexOf('instagram') !== -1) {
      return 'instagram';
    }
    if (str.indexOf('youtube') !== -1) {
      return 'youtube';
    }
    if (str.indexOf('ap-') !== -1) {
      return 'ap';
    }
    if (str.indexOf('re-') !== -1) {
      return 're';
    }

    return str;
  }

  get collectionName() {
    return this._data.article_extras.source;
  }

  /**
   * Gets the content of an Article if it doesn't exisit then return the summary.
   *
   * @returns {string}  - The article content as provided by the fixture
   */
  get content() {
    return this._data.article_content || this._data.article_summary;
  }

  /**
   * Gets the video url for an article if it exists
   *
   * @returns {string}  - The article video url
   */
  get videoUrl() {
    return this._data.article_video_url || '';
  }

  /**
   * Gets the normalized Article title
   *
   * @returns {string}  - Normalized title
   */
  get title() {
    return this._chooseTitle();
  }

  /**
   * Gets the normalized Article title for articles
   *
   * @returns {string}  - Normalized title
   */
  get articleTitle() {
    return this._chooseArticleTitle();
  }

  /**
   * Gets the normalized title for tiles
   *
   * @returns {string}  - Normalized title
   */
  get tileTitle() {
    return this._chooseTileTitle();
  }

  /**
   * Gets the normalized Article sub title for articles if it has one
   *
   * @returns {string}  - Normalized title
   */
  get articleSubTitle() {
    return this._chooseArticleSubTitle();
  }

  /**
   * Gets the normalized Article icon path
   *
   * @returns {string}  - Normalized icon path
   */
  get icon() {
    return `${Properties.assetPath}/${this._chooseIcon()}`;
  }

  /**
   * Gets the normalized Article tile image data
   *
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Normalized tile image data
   */
  get tileImage() {
    return this._chooseTileImage() || this.defaultTileImage;
  }

  /**
   * Gets the normalized Article tile image data
   *
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Normalized tile image data
   */
  get articleImage() {
    return this._chooseArticleImage() || this.defaultTileImage;
  }

  /**
   * Gets the normalized Article HippoGIF GIF data
   *
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Normalized tile image data
   */
  get gifPreview() {
    return this._chooseHippoGIFPreview('gif');
  }

  /**
   * Gets the normalized Article HippoGIF MP4 data
   *
   * @returns {{contentType: string, dimensions: string, name: string, url: string}}  - Normalized tile image data
   */
  get mp4Preview() {
    return this._chooseHippoGIFPreview('mp4');
  }

  /**
   * Gets if this Article has a tile image
   *
   * @returns {boolean} - `true` if the Article contains a tile image; otherwise `false`
   */
  get hasTileImage() {
    return !this.tileImage.isDefault;
  }

  /**
   * Gets if this Article has a HippoGIF GIF preview
   *
   * @returns {boolean} - `true` if the Article contains a HippoGIF GIF preview; otherwise `false`
   */
  get hasGIFPreview() {
    return !!this._gifPreview;
  }

  /**
   * Gets if this Article has a HippoGIF MP4 preview
   *
   * @returns {boolean} - `true` if the Article contains a HippoGIF MP4 preview; otherwise `false`
   */
  get hasMP4Preview() {
    return !!this._mp4Preview;
  }

  /**
   * Gets if this Article contains HippoGIF data
   *
   * @returns {boolean} - `true` if the Article contains HippoGIF data; otherwise `false`
   */
  get isHippoGIF() {
    return !!(this._gifPreview || this._mp4Preview);
  }

  /**
   * Gets if this Article contains video data
   *
   * @returns {boolean} - `true` if the Article contains video data
   */
  get isVideo() {
    return (
      this.source === 'youtube' ||
      this.source === 'brightcove' ||
      this.source === 'videojs'
    );
  }

  /**
   * Gets left info of article
   *
   * @returns {string} - the left info of the article or ''
   */
  get leftInfo() {
    return this._chooseLeftInfo();
  }

  /**
   * Gets right info of article
   *
   * @returns {string} - the right info of the article or ''
   */
  get rightInfo() {
    return this._chooseRightInfo();
  }

  /**
   * Gets profile image from article
   *
   * @returns {string} - the right info of the article or ''
   */
  get profileImage() {
    return (
      this._data.article_extras.profile_image_url ||
      Properties.assetPath + '/brand_icon.jpg'
    ); // TODO: FIXME: article_extras.profile_image_url might need to be updated since we're using static and dynamic paths
  }

  /**
   * Gets video id in extras if there
   *
   * @returns {string} - the id from extras
   */
  get id() {
    return this._data.article_extras.id || '';
  }

  /**
   * Gets the artilce digest (MD5 hash)
   *
   * @returns {string} - the article digest (MD5 hash)
   */
  get digest() {
    return this._data.article_digest || '';
  }

  get extras() {
    return this._data.article_extras || '';
  }

  getFormatedDate(format) {
    return getDateFormatted(this._data.article_published_at, format);
  }

  get dateFromNow() {
    //eturn Moment(this._data.article_published_at).utc().fromNow();
    dateDiff(this._data.article_published_at);
  }

  getTileHeight() {
    return this.tileHeight || 0;
  }

  setTileHeight(tileHeight) {
    this.tileHeight = tileHeight;
  }

  setOffsetTop(offsetTop) {
    this.offsetTop = offsetTop;
  }

  getOffsetTop() {
    return this.offsetTop || 0;
  }

  setMarginTop(marginTop) {
    this.marginTop = marginTop;
  }

  getMarginTop() {
    return this.marginTop || 10;
  }

  /**
   * Clones an Article with duplicate data
   *
   * @returns {Article} - A clone of the source Article
   */
  clone() {
    return new Article(JSON.parse(JSON.stringify(this._data)));
  }
}

export default Article;
