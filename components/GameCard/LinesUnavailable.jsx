import React from 'react';
import { StyleSheet } from 'react-native';
import { Txt } from '../general/Txt';

function _LinesUnavailable({  }) {
  return (
    <>
      <Txt style={s.txt}>Lines currently unavailable.</Txt>
    </>
  );
}

export const LinesUnavailable = React.memo(_LinesUnavailable);

const s = StyleSheet.create({
  txt: {
    fontSize: 13, 
    paddingBottom: 4, 
    fontFamily: 'Saira_400Regular_Italic',
    color: '#E4E6E7'
  }
});