import React from 'react';
import {View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FixtureList from '../../components/fixture/fixtureList';

const Fixtures = () => {
  return (
    <SafeAreaView className='flex-1 bg-background' >
        <View  className ='mb-6 px-4 py-6'>
          <Text className='text-lg font-pbold text-gray-800' >Upcoming Matches</Text>
        </View>
        <View className='mb-6'>
          <FixtureList />
        </View>
    </SafeAreaView>
  );
};

export default Fixtures;
