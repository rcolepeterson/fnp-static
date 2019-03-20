import React, { Component } from 'react'; //eslint-disable-line no-unused-vars
//import FrontPageColumn from 'microzine-3.2/views/partials/FrontPageColumn';
import Page from 'microzine-3.2/api/Page';
import Footer from 'microzine-3.2/views/partials/Footer';
import EndMsg from 'microzine-3.2/views/partials/EndMsg';
import ScrollIndicator from 'microzine-3.2/views/ScrollIndicator';
//import Settings from 'microzine-3.2/helpers/Settings';
import CallToAction from 'microzine-3.2/views/partials/buttons/CtaButton';
import Properties from 'microzine-3.2/helpers/MicrozineProperties';

import MicrozineEvents from 'microzine-3.2/helpers/MicrozineEvents';
//import Scroller from 'microzine-3.2/api/Scroller';
import TileGroup from 'microzine-3.2/views/partials/tile/TileGroup';
import PageIndicator from 'microzine-3.2/views/partials/PageIndicator';
//import Articles from 'microzine-3.2/api/Articles';

import { Wrapper } from 'microzine-3.2/views/FrontPageViews/FrontPage';
import styled from 'styled-components';

const GroupWrapper = styled(Wrapper)`
  max-width: 1022px;
  margin: 0 auto;
  flex-direction: column;
`;

const mobileBreakPoint = 667;

/**
 * Primary Microzine view
 *
 * @version 1.0
 */
class FrontPageGroups extends Component {
  /**
   * Creates a new FrontPage instance
   */
  constructor(props) {
    super(props);

    this._width = Page.width;
    this._currentCollection = [].concat(Properties.articlesWithStatic);
    this._wrapper = document.getElementById('wrapper');

    Page.addEventListener('resize', this.handleResize.bind(this));
    MicrozineEvents.addEventListener('nextcollectionloaded', () => {
      this.setState({ setTiles: true });
    });

    this.state = {
      columnsPerRow: this._width < mobileBreakPoint ? Properties.columns : 2,
      setTiles: true
    };

    this._setTileGroups();
  }

  setNumberOfColumns(nCols) {
    if (nCols !== this.state.columnsPerRow) {
      this.setState({
        columnsPerRow: nCols,
        setTiles: true
      });
    }
  }

  handleResize(e) {
    this._width = e ? e.width : Page.width;

    this.setNumberOfColumns(
      this._width < mobileBreakPoint ? Properties.columns : 2
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.columnsPerRow !== this.state.columnsPerRow) {
      this.tileGroups = [];
      this._currentCollection = [].concat(Properties.articlesWithStatic); // TODO: this._currentCollection
    } else if (nextState.setTiles) {
      this._currentCollection = [].concat(Properties.articlesWithStatic); // TODO: this._currentCollection
      this._setTileGroups();
    }
  }

  _setTileGroups() {
    let groups = [],
      nextGroup = [];

    this._groupIndex = 0;

    while ((nextGroup = this._getNextTileGroup()).length) {
      groups.push(nextGroup);
    }

    // run through the groups and if there is a group that has fewer than one tile per column, combine it with the prev group
    for (let i = 1; i < groups.length; ) {
      let g = groups[i],
        gPrev = groups[i - 1];

      if (g.length < this.state.columnsPerRow * 2) {
        if (Properties.mergeLast) {
          // Merge the last items that didn't fit
          let newGroup = gPrev.concat(g);
          groups.splice(i - 1, 2, newGroup);
        } else if (Properties.cutLast) {
          // Cut the last items that didn't fit
          g.splice(0);
          i++;
        } else {
          i++;
        }
      } else {
        i++;
      }
    }

    this.tileGroups = [];

    groups.forEach((g, i) => {
      if (g.length === 0) {
        return;
      }
      let key = 'g' + i;

      this.tileGroups.push(
        <TileGroup id={key} data={g} columnsPerRow={this.state.columnsPerRow} />
      );
    });

    this.setState({ setTiles: false });
  }

  render() {
    return (
      <div>
        <CallToAction />
        <GroupWrapper>
          {this.tileGroups}
          {Properties.groupsLoadByCollection ? <PageIndicator /> : null}
        </GroupWrapper>
        <EndMsg />
        <Footer />
        <ScrollIndicator />
      </div>
    );
  }

  _getNextTileGroup() {
    if (this._currentCollection.length === 0) {
      return [];
    }

    let group = [],
      thisCollectionName = this._currentCollection[0].article_collection_name,
      hasNextTile = true;

    while (hasNextTile) {
      group.push(this._currentCollection.shift());

      hasNextTile =
        this._currentCollection.length && // is there another article?
        group.length <
          Properties.rowsInGroups[this._groupIndex] *
            this.state.columnsPerRow && // is there room in the current group?
        (Properties.groupsLoadByCollection
          ? this._currentCollection[0].article_collection_name ===
            thisCollectionName
          : true); // is that article part of the same collection? or is groupsLoadByCollection off?
    }

    if (this._groupIndex < Properties.rowsInGroups.length - 1) {
      this._groupIndex++;
    }

    return group;
  }
}

export default FrontPageGroups;
