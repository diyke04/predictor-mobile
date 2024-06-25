import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='sign-in' options={{
            title:"Login"
        }} />
        <Stack.Screen name='sign-up' options={{
            title:"Register"
        }} />
    </Stack>
  )
}

export default _layout