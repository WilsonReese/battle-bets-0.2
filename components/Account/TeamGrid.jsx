import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Txt } from '../../../components/general/Txt';
import { TeamLogo } from '../../../components/GameCard/Matchup/TeamLogo';
import api from '../../../utils/axiosConfig';

const FBS_CONFERENCES = [
  'American','ACC','Big 12','Big Ten','Conference USA',
  'FBS Independents','Mid-American','Mountain West','Pac-12','SEC','Sun Belt'
];

export function TeamGrid({ onSelectTeam, selectedTeamId }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teams')
       .then(res => setTeams(res.data))
       .catch(err => console.error('Failed to fetch teams', err))
       .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#54D18C" />
      </View>
    );
  }

  // filter only FBS conferences
  const fbsTeams = teams.filter(t =>
    FBS_CONFERENCES.includes(t.conference)
  );

  return (
    <View contentContainerStyle={styles.container}>
      <Txt style={styles.heading}>Pick Your Favorite Team</Txt>
      <View style={styles.grid}>
        {/* “None” option */}
        <TouchableOpacity
          key="none"
          style={[
            styles.card,
            selectedTeamId == null && styles.selectedCard,
          ]}
          onPress={() => onSelectTeam(null)}
        >
          <Txt style={styles.teamName}>None</Txt>
        </TouchableOpacity>

        {fbsTeams.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={[
              styles.card,
              selectedTeamId === team.id && styles.selectedCard,
            ]}
            onPress={() => onSelectTeam(team.id)}
          >
            <TeamLogo teamName={team.name} size={48} />
            <Txt numberOfLines={1} ellipsizeMode="tail" style={styles.teamName}>
              {team.name}
            </Txt>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 12,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Saira_600SemiBold',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    margin: 6,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1D394E',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#54D18C',
  },
  teamName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    color: '#F8F8F8',
  },
});
