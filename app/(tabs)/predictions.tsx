import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PredictionList from '../../components/prediction/PredictionList'
import { Text, View } from 'react-native'


const predictions = () => {
  return (
     <SafeAreaView className='flex-1 bg-background' >
     <View  className ='mb-6 px-4 py-6'>
       <Text className='text-lg font-pbold text-gray-800' >Prediction</Text>
     </View>
     <View className='mb-6'>
       <PredictionList />
     </View>
 </SafeAreaView>
  )
}

export default predictions