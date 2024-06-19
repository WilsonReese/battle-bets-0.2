import { Redirect } from "expo-router";

const Index = () => {
	return <Redirect href="/pools" />;
};
export default Index;

// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';
// import Pools from './(tabs)/pools';

// export default function Home() {

//   return (
//     <Pools/>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//   },
// });