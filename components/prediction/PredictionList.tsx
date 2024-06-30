import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../config/https';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean | null;
  point: number;
}

interface League {
  name: string;
  id: number;
  premium: boolean;
}

interface Fixture {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  league: League;
  home_team_ft_score: number | null;
  away_team_ft_score: number | null;
  match_week: number;
  result: string;
  status: string;
}

interface Prediction {
  id: number;
  user: User;
  fixture: Fixture;
  home_prediction_score: string;
  away_prediction_score: string;
  result: string;
  correct_score: string;
}

interface GroupedPredictions {
  [week: string]: {
    [league: string]: Prediction[];
  };
}

const PredictionList: React.FC = () => {
  console.log("called")
  const { token } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPredictions = async () => {
    //const serverUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
    const serverUrl = 'https://predictor-backend-omega.vercel.app/api/predictions';

    try {
      setLoading(true);
      const user_id = (jwtDecode(token) as { id: number }).id;
      const response = await axiosInstance.get(`/api/predictions/user?user_id=${user_id}`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch matches');
      }
      const data: Prediction[] = response.data;
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setError(error.response ? error.response.data.message : 'Failed to fetch predictions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPredictions();

    const interval = setInterval(() => {
      fetchPredictions();
    }, 60000000); 

    return () => clearInterval(interval); 
  }, [token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPredictions();
  }, []);

  const groupedPredictions: GroupedPredictions = predictions.reduce((acc: GroupedPredictions, prediction) => {
    const week = prediction.fixture.match_week.toString();
    const league = prediction.fixture.league.name;

    if (!acc[week]) {
      acc[week] = {};
    }
    if (!acc[week][league]) {
      acc[week][league] = [];
    }

    acc[week][league].push(prediction);
    return acc;
  }, {});

  const getResultStyle = (prediction: Prediction) => {
    if (prediction.fixture.home_team_ft_score === null || prediction.fixture.away_team_ft_score === null) {
      return '';
    }
    return prediction.result === prediction.fixture.result ? 'bg-green-500' : 'bg-red-500';
  };

  const getCorrectScoreStyle = (prediction: Prediction) => {
    if (prediction.fixture.home_team_ft_score === null || prediction.fixture.away_team_ft_score === null) {
      return '';
    }
    return prediction.correct_score === 'correct' ? 'bg-green-500' : 'bg-red-500';
  };

  const calculatePoints = (prediction: Prediction) => {
    let points = 1000; // Points for creating a prediction
    if (prediction.fixture.home_team_ft_score !== null && prediction.fixture.away_team_ft_score !== null) {
      if (prediction.result === prediction.fixture.result) {
        points += 5000; // Points for correct result
      }
      if (prediction.correct_score === 'correct') {
        points += 20000; // Points for correct score
      }
    }
    return points;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  const renderPrediction = ({ item }: { item: Prediction }) => (
    <View className="mb-2 p-1 shadow-md">
      <View className="flex-row bg-gray-300 rounded-lg justify-between items-center p-4">
        <View className='flex-col '>
        <Text className="py-2 text-black text-md font-pmedium">{item.fixture.home_team}</Text>
        <Text className="py-2 text-black text-md font-pmedium">{item.fixture.away_team}</Text>
        </View>

        <View className='flex-col px-4'>
        <Text className="py-2 text-black text-md font-pmedium">{item.home_prediction_score}</Text>
        <Text className="py-2 text-black text-md font-pmedium">{item.away_prediction_score}</Text>
        </View>

        <View className='flex-col px-4'>
        <Text className="py-2 text-black text-md font-pmedium">{item.fixture.home_team_ft_score !== null ? item.fixture.home_team_ft_score : ''}</Text>
        <Text className="py-2 text-black text-md font-pmedium">{item.fixture.away_team_ft_score !== null ? item.fixture.away_team_ft_score : ''}</Text>
        </View>

        <View className={`w-1/8 rounded-lg p-2 justify-center items-center ${getResultStyle(item)}`}>
          <Text className="text-center text-gray-100">
            {item.fixture.home_team_ft_score !== null && item.fixture.away_team_ft_score !== null
              ? (item.result === item.fixture.result ? 'win' : 'lose')
              : '-'}
          </Text>
        </View>
        <View className={`w-1/8 rounded-lg p-2 justify-center items-center ${getCorrectScoreStyle(item)}`}>
          <Text className="text-center text-gray-100">
            {item.fixture.home_team_ft_score !== null && item.fixture.away_team_ft_score !== null
              ? (item.correct_score === 'correct' ? 'win' : 'lose')
              : '-'}
          </Text>
        </View>
        <Text className="w-1/8 text-center">{calculatePoints(item)}</Text>
      </View>
    </View>
  );
  

  const renderLeague = ({ item }: { item: { league: string, data: Prediction[] } }) => (
    <View className="mb-4">
      <Text className="font-semibold mb-1 text-gray-300">{item.league}</Text>
      <FlatList
        data={item.data}
        keyExtractor={prediction => prediction.id.toString()}
        renderItem={renderPrediction}
      />
    </View>
  );

  const renderWeek = ({ item }: { item: { week: string, data: { league: string, data: Prediction[] }[] } }) => (
    <View key={item.week} className="mb-4 p-4 rounded-lg shadow-md">
      <Text className="text-xl font-bold mb-2 text-gray-500">Match Week {item.week}</Text>
      <FlatList
        data={item.data}
        keyExtractor={league => league.league}
        renderItem={renderLeague}
        onRefresh={onRefresh}
      />
    </View>
  );

  const weeks = Object.keys(groupedPredictions).map(week => ({
    week,
    data: Object.keys(groupedPredictions[week]).map(league => ({
      league,
      data: groupedPredictions[week][league],
    })),
  }));

  return (
    <FlatList
      data={weeks}
      keyExtractor={week => week.week}
      renderItem={renderWeek}
    />
  );
};

export default PredictionList;
