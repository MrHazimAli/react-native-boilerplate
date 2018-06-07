import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation/src/react-navigation';
import { connect } from 'react-redux';
import {
  createNavigationPropConstructor,
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  initializeListeners,
} from 'react-navigation-redux-helpers';
import AppNavigator from '../navigator';

const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);
const navigationPropConstructor = createNavigationPropConstructor("root");

@connect(
  state => ({
    nav: state.nav,
  }),
  dispatch => ({ dispatch }),
)
export default class AppWithNavigationState extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  };

  componentDidMount() {
    initializeListeners("root", this.props.nav);

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.dispatch(NavigationActions.back());
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    const navigation = navigationPropConstructor(
      this.props.dispatch,
      this.props.nav,
    );
    return <AppNavigator navigation={navigation} />;
  }
}
