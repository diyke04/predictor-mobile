import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../config/https';

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
  const { token } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axiosInstance.get('/predictions/user'); // Adjust endpoint as per your backend setup
        if (response.status !== 200) {
          throw new Error('Failed to fetch predictions');
        }
        const data: Prediction[] = response.data;
        setPredictions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setError('Failed to fetch predictions');
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [token]);

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
    <View className="mb-4 p-4 bg-background rounded-lg shadow-md">
      <View className="flex-row justify-between items-center p-2">
        <Text className="flex-1">{item.fixture.home_team} vs {item.fixture.away_team}</Text>
        <Text className="flex-1">
          {item.fixture.home_team_ft_score !== null ? item.fixture.home_team_ft_score : '-'} - {item.fixture.away_team_ft_score !== null ? item.fixture.away_team_ft_score : '-'}
        </Text>
        <Text className="flex-1">{item.home_prediction_score} - {item.away_prediction_score}</Text>
        <View className={`flex-1 rounded-lg p-2 justify-center items-center ${getResultStyle(item)}`}>
          <Text className="text-center text-gray-100">
            {item.fixture.home_team_ft_score !== null && item.fixture.away_team_ft_score !== null
              ? (item.result === item.fixture.result ? 'win' : 'lose')
              : '-'}
          </Text>
        </View>
        <View className={`flex-1 rounded-lg p-2 justify-center items-center ${getCorrectScoreStyle(item)}`}>
          <Text className="text-center text-gray-100">
            {item.fixture.home_team_ft_score !== null && item.fixture.away_team_ft_score !== null
              ? (item.correct_score === 'correct' ? 'win' : 'lose')
              : '-'}
          </Text>
        </View>
        <Text className="flex-1">{calculatePoints(item)}</Text>
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
