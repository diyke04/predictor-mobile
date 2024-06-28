import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '../../config/https';




type RootStackParamList = {
  FixtureList: { leagueId: number };
};

type FixtureListRouteProp = RouteProp<RootStackParamList, 'FixtureList'>;

const FixtureList: React.FC = () => {
  const { token } = useAuth();
  const route = useRoute<FixtureListRouteProp>();
  const { leagueId } = route.params;
  const [matches, setMatches] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<{ [key: number]: Prediction }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      console.log(token)
      try {
        const serverUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
        //const serverUrl = 'https://predictor-backend-omega.vercel.app/api/predictions';
        const response = await axios.get(`${serverUrl}/api/fixtures/user/not-predicted?league_id=${1}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setMatches(response.data);
        } else {
          console.error('Error fetching matches:', response.data);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        Alert.alert('Error', 'Error fetching matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token, leagueId]);

  const postPrediction = async (prediction: Prediction) => {
    try {
      const response = await axiosInstance.post('https://predictor-backend-omega.vercel.app/api/predictions', prediction);

      if (response.status === 200) {
        setMatches((prevMatches) => prevMatches.filter(match => match.id !== prediction.fixture_id));
      } else {
        throw new Error('Failed to post prediction');
      }
    } catch (error) {
      console.error('Error posting prediction:', error);
      Alert.alert('Error', 'Error posting prediction');
    }
  };

  const handlePredictionChange = debounce((fixtureId: number, homeScore: string | null, awayScore: string | null) => {
    if (homeScore === null || awayScore === null) return;

    const prediction: Prediction = { fixture_id: fixtureId, home_prediction_score: homeScore, away_prediction_score: awayScore };
    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      [fixtureId]: prediction,
    }));
    postPrediction(prediction);
  }, 600);

  const handleSelectChange = (value: string, fixtureId: number, type: 'home' | 'away') => {
    const currentPrediction = predictions[fixtureId] || { fixture_id: fixtureId, home_prediction_score: null, away_prediction_score: null };
    const updatedPrediction = type === 'home'
      ? { ...currentPrediction, home_prediction_score: value }
      : { ...currentPrediction, away_prediction_score: value };

    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      [fixtureId]: updatedPrediction,
    }));

    if (updatedPrediction.home_prediction_score !== null && updatedPrediction.away_prediction_score !== null) {
      handlePredictionChange(fixtureId, updatedPrediction.home_prediction_score, updatedPrediction.away_prediction_score);
    }
  };

  const renderItem = ({ item }: { item: Fixture }) => (
    <View key={item.id} className="bg-background rounded-lg p-4 mb-4 shadow-md">
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-100">{item.league.name}</Text>
        <Text className="text-sm text-gray-100">{new Date(item.match_date).toLocaleString()}</Text>
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-bold">{item.home_team}</Text>
        <Text className="text-gray-100">vs</Text>
        <Text className="font-bold">{item.away_team}</Text>
      </View>
      <View className="flex-row justify-between">
        <View className="w-1/2 pr-2">
          <Text className="text-sm text-gray-100">Home Score</Text>
          <Picker
            selectedValue={predictions[item.id]?.home_prediction_score || ''}
            style={{ height: 50, width: '100%' }}
            onValueChange={(value) => handleSelectChange(value, item.id, 'home')}
          >
            <Picker.Item label="Select" value="" />
            {Array.from({ length: 13 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={`${i}`} />
            ))}
          </Picker>
        </View>
        <View className="w-1/2 pl-2">
          <Text className="text-sm text-gray-100">Away Score</Text>
          <Picker
            selectedValue={predictions[item.id]?.away_prediction_score || ''}
            style={{ height: 50, width: '100%' }}
            onValueChange={(value) => handleSelectChange(value, item.id, 'away')}
          >
            <Picker.Item label="Select" value="" />
            {Array.from({ length: 13 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={`${i}`} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={matches}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16, backgroundColor: '#f0f0f0' }}
      ListEmptyComponent={<Text className="text-center text-gray-100">No matches available</Text>}
      getItemLayout={(data, index) => (
        { length: 150, offset: 150 * index, index }
      )}
    />
  );
};

export default FixtureList;
