import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
import Settings from 'microzine-3.2/helpers/Settings';
import Footer from 'microzine-3.2/views/partials/Footer';
import Promotion from 'microzine-3.2/views/partials/article/Promotion';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';

class SettingsPage extends Component {
  handleFilterClick(evt) {
    let channel = evt.currentTarget.firstChild.getAttribute('data-channel');
    if (evt.currentTarget.classList.contains('disable_channel')) {
      return;
    }
    evt.currentTarget.firstChild.classList.toggle('fade_settings_out');
    Settings.toggleFiltered(channel);
    //don't allow last channel to be disabled
    if (Settings.numChannelsFiltered() === Properties.collections.length - 1) {
      this.disableChannel();
    } else if (this.disabledChannel !== null) {
      this.enableChannel();
    }
    Settings.commitSettings();
  }

  disableChannel() {
    Properties.collections.forEach(source => {
      if (!Settings.isFiltered(source.collection)) {
        let elem = document.querySelector(
          "[data-channel='" + source.collection + "']"
        );
        this.disabledChannel = elem.parentNode;
        this.disabledChannel.classList.add('disable_channel');
      }
    });
  }

  componentDidMount() {
    if (Settings.numChannelsFiltered() === Properties.collections.length - 1) {
      this.disableChannel();
    }
  }
  enableChannel() {
    this.disabledChannel.classList.remove('disable_channel');
    this.disabledChannel = null;
  }
  componentWillMount() {
    this.disabledChannel = null;
  }
  render(props) {
    let channelItems = Properties.collections.map(source => {
      let isFiltered = '';
      let name = source.title || source.name || source.collection;
      if (Settings.isFiltered(source.collection)) {
        isFiltered = 'fade_settings_out';
      }
      return (
        <div onClick={this.handleFilterClick.bind(this)}>
          <div
            data-channel={source.collection}
            className={'button_slider ' + isFiltered}>
            <div className="slider" />
          </div>
          {source.icon || (
            <span
              className="settings_icon"
              style={{
                backgroundImage: `url(${Properties.assetPath}/${
                  source.collection
                }_icon.png)`
              }}
            />
          )}
          <span>{name}</span>
        </div>
      );
    }, this);
    return (
      <div className="settings_wrapper">
        <div className="settings_page">
          <span>channels</span>
          {channelItems}
        </div>
        <Promotion data={props.data} />
        <Footer data={props.data} />
      </div>
    );
  }
}

export default SettingsPage;
