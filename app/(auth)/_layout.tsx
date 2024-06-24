import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='Sign in' options={{
            title:"Login"
        }} />
        <Stack.Screen name='Sign up' options={{
            title:"Register"
        }} />
    </Stack>
  )
}

export default _layout