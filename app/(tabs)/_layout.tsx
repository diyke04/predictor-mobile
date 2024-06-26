import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const TabLayout = () => {
  return (
    
        <Tabs screenOptions={{headerShown:false}}>
        <Tabs.Screen name='fixtures' options={{
          tabBarLabel:"Fixture",
          tabBarIcon:({color})=><Ionicons name="calendar" size={24} color={color} />
        }} />
        <Tabs.Screen name='predictions' options={{
          tabBarLabel:"Predictions",
          tabBarIcon:({color})=><Ionicons name="heart-sharp" size={24} color={color} />
        }}/>

      <Tabs.Screen name='profile'
        options={{
          tabBarLabel:"Profile",
          tabBarIcon:({color})=><Ionicons name="people" size={24} color={color} />
        }}
        />
    </Tabs>

  )
}

export default TabLayout