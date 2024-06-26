import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const _layout = () => {
  return (
    <>
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name='sign-in' options={{
            title:"Login"
        }} />
        <Stack.Screen name='sign-up' options={{
            title:"Register"
        }} />
    </Stack>
    <StatusBar backgroundColor='#5c52ff' style='light'/>
    </>
  )
}

export default _layout