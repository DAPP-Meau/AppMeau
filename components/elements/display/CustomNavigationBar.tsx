import React from 'react';
import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import { withTheme } from 'react-native-paper';

function CustomNavigationBar({ navigation, route, options, back, theme }) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header style={{backgroundColor: theme.colors.primaryContainer}}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

export default withTheme(CustomNavigationBar)