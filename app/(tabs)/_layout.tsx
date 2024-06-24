import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{headerShown:false}}>
        <Tabs.Screen name='home'
        options={{
          tabBarLabel:"Home",
          tabBarIcon:({color})=><Ionicons name="home" size={24} color={color} />
        }}
        />
        <Tabs.Screen name='fixtures' options={{
          tabBarLabel:"Fixture",
          tabBarIcon:({color})=><Ionicons name="calendar" size={24} color={color} />
        }} />
        <Tabs.Screen name='predictions' options={{
          tabBarLabel:"Predictions",
          tabBarIcon:({color})=><Ionicons name="heart-sharp" size={24} color={color} />
        }}/>
    </Tabs>
  )
}

export default TabLayout