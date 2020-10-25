import * as React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import listArtists from './listArtists';
import listTracks from './listTracks';
import {Header} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

function home({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Header
        leftComponent={{
          text: 'menu',
          style: {color: '#fff'},
          onPress: () => {
            navigation.openDrawer();
          },
        }}
        centerComponent={{
          text: 'Home',
          style: {color: '#fff'},
        }}
      />
      <View style={{flex: 1, flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Tracks');
          }}
          style={{flexDirection: 'column'}}>
          <Text style={styles.item}>Tracks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Artists');
          }}
          style={{flexDirection: 'column'}}>
          <Text style={styles.item}>Artists</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function Viewone() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="home">
        <Drawer.Screen name="home" component={home} />
        <Drawer.Screen name="Artists" component={listArtists} />
        <Drawer.Screen name="Tracks" component={listTracks} />        
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  item: {
    height: height / 3,
    width: width / 2,
    position: 'relative',
    backgroundColor: '#DBDAD9',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'bold',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#20232a',
  },
});
