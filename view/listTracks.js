import NetInfo from '@react-native-community/netinfo'
import React, { Component } from 'react';
import {
  Dimensions,
  View,
  FlatList
} from 'react-native';
import {serviceMethod} from './services/services';
import {ListItem, Header, SearchBar, ButtonGroup,Overlay, Text,Image} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import {color} from 'react-native-reanimated';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

export default class ListTrackslistTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTracks: [],
      loanding: false,
      isVisible: false,
      search: '',
      dataSearch: [],
      selectedIndex: 2,
      page: 0,
      listAll: [],
      visible: false,
      selectedTrack: '',
      storage: null
    }      
  }
  async getData() {
    const data = {
      url:
        'http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=spain&api_key=829751643419a7128b7ada50de590067&format=json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {},
    };
    this.setState({loanding: true});
    const result = await serviceMethod(data);
    this.setState({loanding: false})
    if (result.status === 200) {
      let data = result.dataBody.tracks.track
      this.setState({listAll : JSON.parse(JSON.stringify(data))})
      this.paginador(data)
      
    } else {
      alert('Error en el servicio');
    }
  }

  paginador = data => {
    let arrayPaginador = []
    let arrayAll = data
    for (let index = 0; index < arrayAll.length; index++) {
      arrayPaginador.push(data.splice(0, 10));
    }
    if (arrayAll.length > 0) {
      for (let index = 0; index < arrayAll.length; index++) {
        arrayPaginador.push(data.splice(0, 10));
      }
    }
    this.setState({ page: 0, listTracks: arrayPaginador });
  }

  async componentWillMount() {
   let isConnected = await NetInfo.fetch()    
    isConnected.isConnected ? this.getData() : storage ()
  }

  storage = () => {
    
  }

  search = (value) => {
    let filter = this.state.listAll.filter((item)=> item.name.indexOf(value) > -1 && item )
    this.setState({ search: value})
    this.paginador(filter)
    
  }

  selectPaginate = (selected) => {    
    if (selected == 1 && this.state.page < this.state.listTracks.length-1) {
      this.setState({ page: this.state.page + 1 })      
    } else if (selected == 0 && this.state.page > 0) {
      this.setState({ page: this.state.page - 1 })  
    }    
  }
  
  toggleOverlay = () => {
    this.setState({visible:!this.state.visible})
  }

  renderItem(item, onPress) {
    return (
      <TouchableOpacity
        style={{
          height: 90,
          backgroundColor: 'white',
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      onPress={() => {  
          this.setState({ visible: true, selectedTrack: item.item })            
        }}
      >
        <View style={{padding: 10, flexDirection: 'row'}}>
          <Image
            style={{width: 50, height: 50}}
            source={{
              uri: item.item.image[0]['#text'],
            }}
          />
          <View
            style={{
              padding: 5,
              flexDirection: 'column',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: 'bold'}}>Track: </Text>
              <Text> {item.item.name}</Text>
              <Text style={{fontWeight: 'bold', paddingLeft: 10}}>
                listeners:
              </Text>
              <Text>{item.item.listeners}</Text>
            </View>
            <View style={{flexDirection: 'row', width: width - 120}}>
              <Text style={{fontWeight: 'bold'}}>Web Site: </Text>
              <Text>{item.item.url}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const buttons = ['<<', '>>']
    const { selectedIndex } = this.state
    return (
      <View style={{flex: 1}}>
        <Header
          leftComponent={{
            text: 'menu',
            style: {color: '#fff'},
            onPress: () => {
              this.props.navigation.openDrawer();
            },
          }}
          centerComponent={{
            text: this.props.route.name,
            style: {color: '#fff'},
          }}
        />
        <SearchBar
          placeholder="Buscar"
          onChangeText={(value) => {           
            this.search(value)
          }}
          value={this.state.search}
          containerStyle={{backgroundColor: 'white', color: 'black'}}
          inputContainerStyle={{backgroundColor: '#DBDAD9', color: 'black'}}
        />
        {!this.state.loanding ? (
          <ScrollView>
          <FlatList
            scrollEnabled={true}
            nestedScrollEnabled={true}
            bounces={false}
            showsVerticalScrollIndicator={false}
            data={this.state.listTracks.length > 0 ? this.state.listTracks[this.state.page]:this.state.listTracks}
            renderItem={item => {
              return this.renderItem(item);
            }}
          />
          <ButtonGroup
            onPress={this.selectPaginate}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{backgroundColor:'#DBDAD9'}}
            />
            </ScrollView>
        ) : (
          <ActivityIndicator size="small" color="#0370d1" />
        )}
        <Overlay isVisible={this.state.visible} onBackdropPress={this.toggleOverlay} >
          {this.state.selectedTrack != ''&& (<View>
            <Text h2 h2Style={{ textAlign: 'center' }}>{this.state.selectedTrack.name}</Text>
            <Text h3 h3Style={{ textAlign: 'center' }}>Artista: {this.state.selectedTrack.artist.name}</Text>
            <Image
                source={{ uri: this.state.selectedTrack.image[3]['#text'] }}
                style={{ width: '100%' , height: 200 }}
            />
            <Text h4>Duración: {this.state.selectedTrack.duration}</Text>
            <Text h4>Oyentes: {this.state.selectedTrack.listeners}</Text>
            <Text h4>transmitible: {this.state.selectedTrack.streamable.fulltrack}</Text>           
            <Text h4>Url: {this.state.selectedTrack.url}</Text>            
          </View>)}
          </Overlay>
      </View>
    );
  }
}
