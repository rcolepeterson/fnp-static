import Storage from 'microzine-3.2/api/Storage';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';
let _settings = {};

class Settings {
  static _initialize() {
    if (Storage.getItem('settings')) {
      _settings = Storage.getItem('settings');
    } else {
      Properties.collections.forEach(
        collection => (_settings[collection.collection] = false)
      );
    }
  }

  static get settings() {
    return Storage.getItem('settings') || _settings;
  }

  static commitSettings() {
    Storage.setItem('settings', _settings);
  }

  static toggleFiltered(channel) {
    if (_settings.hasOwnProperty(channel)) {
      _settings[channel]
        ? (_settings[channel] = false)
        : (_settings[channel] = true);
    }
  }

  static isFiltered(channel) {
    if (_settings.hasOwnProperty(channel)) {
      return _settings[channel];
    }
    return false;
  }

  static numChannelsFiltered() {
    let count = 0;
    for (let channel in _settings) {
      if (_settings.hasOwnProperty(channel) && _settings[channel]) {
        count++;
      }
    }
    return count;
  }
}

Settings._initialize(Settings);

export default Settings;
