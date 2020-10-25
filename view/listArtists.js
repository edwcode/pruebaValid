import React, {Component} from 'react';
import {
  Dimensions,
  View,
  FlatList,
  Linking
} from 'react-native';
import {serviceMethod} from './services/services';
import {ListItem, Header, SearchBar, ButtonGroup,Overlay, Text,Image} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
const {width} = Dimensions.get('window');
export default class ListArtists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listArtists: [],
      loanding: false,
      search: '',
      dataSearch: [],
      selectedIndex: 2,
      page: 0,
      listAll: [],
      visible: false,
      selectedArtist: ''
    };
  }
  async getData() {
    const data = {
      url:
        'http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=spain&api_key=829751643419a7128b7ada50de590067&format=json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {},
    };
    const result = await serviceMethod(data);
    this.setState({loanding: true});
    if (result.status === 200) {    
      const data = result.dataBody.topartists.artist
      
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
    this.setState({ page: 0, listArtists: arrayPaginador });
  }

  componentWillMount() {
    this.getData();
  }
  renderItem(item, onPress) {
    return (
      <ListItem
        title={item.item.name}
        leftAvatar={{ source: { uri: item.item.image[0]['#text'] } }}
        onPress={() => {  
          this.setState({ visible: true, selectedArtist: item.item })            
        }}
        bottomDivider
      />
    );
  }

  search = (value) => {
    let filter = this.state.listAll.filter((item)=> item.name.indexOf(value) > -1 && item )
    this.setState({ search: value})
    this.paginador(filter)
    
  }

  selectPaginate = (selected) => {    
    if (selected == 1 && this.state.page < this.state.listArtists.length-1) {
      this.setState({ page: this.state.page + 1 })      
    } else if (selected == 0 && this.state.page > 0) {
      this.setState({ page: this.state.page - 1 })  
    }    
  }
  
  toggleOverlay = () => {
    this.setState({visible:!this.state.visible})
  }

  openUrl = (url) => {
    Linking.openURL(url).catch((error) => {
      alert('Error al abrir Url')
    })
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
        {this.state.loanding ? (
          <ScrollView>
          <FlatList
            scrollEnabled={true}
            nestedScrollEnabled={true}
            bounces={false}
            showsVerticalScrollIndicator={false}          
            data={this.state.listArtists.length > 0 ? this.state.listArtists[this.state.page]:this.state.listArtists}  
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
          {this.state.selectedArtist != ''&& (<View>
            <Text h2 h2Style={{ textAlign: 'center' }}>{this.state.selectedArtist.name}</Text>
            <Image
                source={{ uri: this.state.selectedArtist.image[4]['#text'] }}
                style={{ width: '100%' , height: 200 }}
            />
            <Text h4>Oyentes: {this.state.selectedArtist.listeners}</Text>
            <Text h4>transmitible: {this.state.selectedArtist.streamable}</Text>
            <Text h4>Url: {this.state.selectedArtist.url}</Text>
          </View>)}
          </Overlay>
      </View>
    );
  }
}
