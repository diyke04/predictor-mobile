import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { axiosInstance } from '../../config/https';




interface Prediction {
  id: number;
  user: User;
  fixture: Fixture;
  home_prediction_score: string;
  away_prediction_score: string;
  result: string;
  correct_score: string;
}

const PredictionList: React.FC = () => {
  const { token } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axiosInstance.get('/predictions/user'); 
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

  const getResultStyle = (prediction: Prediction) => {
    if (prediction.fixture.home_team_ft_score === null || prediction.fixture.away_team_ft_score === null) {
      return {};
    }
    return prediction.result === prediction.fixture.result ? { backgroundColor: '#34D399' } : { backgroundColor: '#EF4444' };
  };

  const getCorrectScoreStyle = (prediction: Prediction) => {
    if (prediction.fixture.home_team_ft_score === null || prediction.fixture.away_team_ft_score === null) {
      return {};
    }
    return prediction.correct_score === 'correct' ? { backgroundColor: '#34D399' } : { backgroundColor: '#EF4444' };
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  // Group predictions logic remains the same, omitted for brevity

  return (
    <FlatList
      data={predictions}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <Text className="text-xl font-bold mb-2">Match Week {item.fixture.match_week}</Text>
          <View className="mb-2">
            <Text className="font-semibold mb-1 text-gray-500">{item.fixture.league.name}</Text>
            <View className="bg-white rounded-lg overflow-hidden shadow-md">
              <View className="flex-row justify-between items-center p-2">
                <Text className="flex-1">{item.fixture.home_team} vs {item.fixture.away_team}</Text>
                <Text className="flex-1">
                  {item.fixture.home_team_ft_score !== null ? item.fixture.home_team_ft_score : '-'} - {item.fixture.away_team_ft_score !== null ? item.fixture.away_team_ft_score : '-'}
                </Text>
                <Text className="flex-1">{item.home_prediction_score} - {item.away_prediction_score}</Text>
                <View style={[getResultStyle(item)]} className='flex-1 rounded-lg p-2 justify-center items-center'>
                  <Text className="text-center text-white">
                    {item.fixture.home_team_ft_score !== null && item.fixture.away_team_ft_score !== null
                      ? (item.result === item.fixture.result ? 'win' : 'lose')
                      : '-'}
                  </Text>
                </View>
                <View style={[getCorrectScoreStyle(item)]} className='flex-1 rounded-lg p-2 justify-center items-center'>
                  <Text className="text-center text-white">
                    {item.fixture.home_team_ft_score !== null && item.fixture.away_team_ft_score !== null
                      ? (item.correct_score === 'correct' ? 'win' : 'lose')
                      : '-'}
                  </Text>
                </View>
                <Text className="flex-1">{calculatePoints(item)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default PredictionList;
