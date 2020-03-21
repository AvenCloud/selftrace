import * as React from 'react';
// import fetch from 'isomorphic-fetch';
import { NextPageContext } from 'next';
import { StyleSheet, View } from 'react-native';
import { A } from '@expo/html-elements';
import { t } from 'i18n-js';
import { bindActionCreators } from 'redux';
import Router from 'next/router';
import { connect } from 'react-redux';
import Text from '../../components/Text';
import BottomTab from '../../components/BottomTab';
import SubmitButton from '../../components/SubmitButton';
import { PRIMARY_COLOR, RED_COLOR } from '../../styles/colors';
import { MARGIN_Y } from '../../styles';
import { AuthStatus } from '../../data-types';
import * as SignoutActions from '../../actions/auth/signout';
import * as AuthStatusActions from '../../actions/auth/status';
import { Action, Dispatch } from '../../actions';
import { ReduxRoot } from '../../reducers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontWeight: '900',
    color: PRIMARY_COLOR.toString(),
    fontSize: 28,
  },
  formContainer: {
    width: '100%',
    marginTop: MARGIN_Y,
  },
  signoutText: {
    color: 'red',
  },
});

const mapStateToProps = (state: ReduxRoot) => ({
  progress: state.auth.signout.progress,
  authStatus: state.auth.status,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
  bindActionCreators(
    {
      signoutUser: SignoutActions.signoutUser,
      clearProgress: () => (d: Dispatch) => d(SignoutActions.clearSignoutProgress()),
      subscribeToAuthStateChange: AuthStatusActions.subscribeToAuthStateChange,
    },
    dispatch
  );

interface Props extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
  pathname: string;
}

function AccountPage({ signoutUser, pathname, subscribeToAuthStateChange, authStatus }: Props) {
  const authListenerUnsubscriber = React.useRef(null);

  React.useEffect(() => {
    if (authStatus === AuthStatus.SignedOut) {
      Router.push('/');
    }
  }, [authStatus]);

  React.useEffect(() => {
    authListenerUnsubscriber.current = subscribeToAuthStateChange();
  }, []);

  React.useEffect(() => () => {
    if (authListenerUnsubscriber.current) {
      authListenerUnsubscriber.current();
    }
  });

  React.useEffect(() => {
    if (authStatus === AuthStatus.SignedOut) {
      Router.push('/');
    }
  }, [authStatus]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <A href="/account/profile">
          <Text>Profile</Text>
        </A>
        <A href="/account/profile">
          <Text>Update password</Text>
        </A>
        <SubmitButton
          label={t('buttons.signout')}
          disabled={false}
          onPress={() => {
            signoutUser();
          }}
          backgroundColor={RED_COLOR}
        />
      </View>
      <BottomTab pathname={pathname} />
    </>
  );
}

AccountPage.getInitialProps = async (ctx: NextPageContext) => {
  // do async stuff here to load data
  // ctx.query is the ?params
  // eg:
  // let url = getApiUrl(urlWithQuery('/libraries', ctx.query), ctx);
  // let response = await fetch(url);
  // let result = await response.json();

  return {
    // data: result,
    // query: ctx.query,
    pathname: ctx.pathname,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
