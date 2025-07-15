import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Txt } from '../../../components/general/Txt';
import { TeamLogo } from '../../../components/GameCard/Matchup/TeamLogo';
import api from '../../../utils/axiosConfig';

const FBS_CONFERENCES = [
  'American','ACC','Big 12','Big Ten','Conference USA',
  'FBS Independents','Mid-American','Mountain West','Pac-12','SEC','Sun Belt'
];

const FCS_CONFERENCES = [
  'ASUN-WAC','ASUN','Big Sky','Big South','Big South-OVC','CAA',
  'FCS Independents','Great West','Ivy','MEAC','Missouri Valley',
  'Northeast','Ohio Valley','Patriot League','Pioneer','Southern',
  'Southland','SWAC','UAC'
];

export function TeamsByConference() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teams')
      .then(res => {
        setTeams(res.data);
      })
      .catch(err => console.error('Failed to fetch teams', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Txt>Loading teams…</Txt>;
  }

  const renderConference = (confName) => {
    const confTeams = teams.filter(t => t.conference === confName);
    if (confTeams.length === 0) return null;

    return (
      <View key={confName} style={s.conferenceSection}>
        <Txt style={s.conferenceTitle}>{confName}</Txt>
        <View style={s.teamGrid}>
          {confTeams.map(team => (
            <View key={team.id} style={s.teamCard}>
              <TeamLogo teamName={team.name} size={32} />
              <Txt style={s.teamName}>{team.name}</Txt>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={s.container}>
      <Txt style={s.heading}>FBS Conferences</Txt>
      {FBS_CONFERENCES.map(renderConference)}

      <Txt style={s.heading}>FCS Conferences</Txt>
      {FCS_CONFERENCES.map(renderConference)}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Saira_600SemiBold',
    marginVertical: 8,
  },
  conferenceSection: {
    marginBottom: 16,
  },
  conferenceTitle: {
    fontSize: 16,
    fontFamily: 'Saira_600SemiBold',
    marginBottom: 8,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  teamCard: {
    width: 80,
    alignItems: 'center',
    margin: 4,
  },
  teamName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
