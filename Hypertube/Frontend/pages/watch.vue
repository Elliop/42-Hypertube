<template>
  <v-col>
    <v-card>
      <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}
          <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </div>
      <v-row>
        <v-col>
          <v-row>
            <v-col class="my-6 mx-9">
              <v-row align="center" justify="center" class="mt-5">
                <span class="font-weight-black display-1">{{ Title }}</span>
              </v-row>
              <v-row align="center" justify="center" class="my-6">
                <v-avatar size="250" align="center" justify="center">
                  <img :src="Pic" />
                </v-avatar>               
              </v-row>
              <v-row align="center" justify="center">
                <v-rating background-color="yellow accent-4" color="yellow accent-4" v-model="Rating" length="10" half-increments hover readonly size="12" dense></v-rating>
                <span class="mx-1 yellow--text">({{ Rating }})</span>
              </v-row>
              <v-row align="center" justify="center" class="mt-5">
                <v-col align="center" justify="center">
                  <span class="subtitle-1 font-weight-medium">Production Year {{ Year }}</span>
                </v-col>              
                <v-col align="center" justify="center">
                  <span class="subtitle-1 font-weight-medium">{{ runtime }} min</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="mx-6 my-6">
              <v-row>
                <v-card color="info" class="px-6 py-6">
                  <span>{{ Description }}</span>
                </v-card>              
              </v-row>
              <v-row class="my-3">
                <v-card color="info" class="px-6 py-6" width="100%">
                  <span style="text-transform: uppercase" class="subtitle-1 font-weight-medium" v-for="(item, index) in Gender" :key="index">
                    {{ item }}
                  </span>
                </v-card>
              </v-row>
              <v-row class="my-3">
                <v-card color="info" class="px-6 py-6" width="100%">
                  <span class="subtitle-1 font-weight-medium" v-for="(item, index) in Actors" :key="index">
                    {{ item }}
                  </span>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-card width="100%" class="my-6">
      <v-row>
        <v-col v-for="(item, index) in hash" :key="index" align="center" justify="center">
          <v-btn @click="() => ft_stream(item.quality, item.hash)">
            {{ item.quality }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" class="my-5">
        <video id="player" ref="player" playsinline controls width="90%" align="center" justify="center" crossorigin="anonymous" class="mb-9">
            <source :src="src" type="video/mp4" />
              <track v-for="item in items" :key="item.uniqueId" :src="item.file" kind="subtitles" :srclang="item.lang" :label="item.lang" :default="item.default" >
        </video>
      </v-row>
    </v-card>
    <v-row width="100%" align="center" justify="center">
      <v-form v-model="valid">
        <v-row class="my-6">
          <v-text-field label="Comment" outlined class="mx-3" v-model="comment" :rules="commentRules"></v-text-field>
          <v-btn @click="ft_comment" :disabled="!valid" color="primary" class="mt-2"><v-icon>mdi-send</v-icon></v-btn>
        </v-row>
      </v-form>      
    </v-row>
    <v-row width="100%" align="center" justify="center" class="my-5">
      <v-card>
        <v-row v-for="(item, index) in comm" :key="index" class="my-6 mx-6">
          <span>
            {{ item.username }} : {{ item.comment }}
          </span>              
        </v-row>
      </v-card>
    </v-row>
  </v-col>
</template>

<script>
import jwt_decode from 'jwt-decode';
import axios from "axios";
export default {
  layout: "app",
  data() {
    return {
      commentRules: [ v => !!v || 'Comment is required', ],
      hash: [],
      comm: [],
      Gender: [],
      Actors: [],
      items: [],
      url: "",
      src: "",
      img: "",
      lang: "",
      comment: "",
      Description: "",
      Title: "",
      Pic: "",
      id: 0,
      imdb: 0,
      runtime: 0,
      Year: 1999,
      Rating: 8,
      valid: true,
////////////// SNACKBAR ///////////////
      snackbar: false,
      timeout: 8000,
      text: "text",
    };
  },
  mounted() {
//////////////// Mounted ////////////
  var token = this.$cookies.get('token');
  axios({
        method: 'post',
        url: 'http://localhost:3000/jwt/',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (response.data == false)
        this.$router.push("/");
    })
    .catch(error => {
      console.log(error);
  });
//////////////// Movie lang ////////////
    var decoded = jwt_decode(token);
    axios({
          method: 'get',
          url: `http://localhost:3000/user/${decoded.username}`,
          headers: { 'Authorization': `Bearer ${token}` }
      })
    .then((res) => {
        this.lang = res.data.data[0].language;
    })
    .catch(function(err) {
        return { err }
    })
    var id = this.$cookies.get('id');
    var imdb = this.$cookies.get('imdb');
    var img = this.$cookies.get('img');
    var token = this.$cookies.get('token');
    this.imdb = imdb;
//////////////// Movie comment ////////////
    axios({
          method: 'get',
          url: `http://localhost:3000/comment?imdb=${imdb}`,
          headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(data => {
      let tmp = [];
      for (let index = 0; index < data.data.data.length; index++) {
        const element = data.data.data[index];
        tmp.push({
          uniqueId: index,
          username: element.username,
          comment: element.value,
        });
      }
      this.comm = tmp;
    })
    .catch(err => console.log(err));
//////////////// Movie Info ////////////
    let obj = {};
    let obj2 = {};
    obj2.imdb = imdb;
    obj.id = id;
    obj.imdb = imdb;
    obj.img = img;
    axios
    .post("http://localhost:3000/imdb", obj)
    .then(data => {
      this.id = data.data.movie[0].id;
      this.Title = data.data.movie[0].title;
      this.Description = data.data.movie[0].description;
      this.Year = data.data.movie[0].year;
      this.Gender = data.data.movie[0].genres;
      this.Actors = data.data.movie[0].actors;
      this.Pic = data.data.movie[0].big_image;
      this.Rating = data.data.movie[0].rating;
      this.runtime = data.data.movie[0].runtime;
      this.hash = data.data.movie[0].items;
      this.src = `http://localhost:3000/stream?hash=${data.data.movie[0].items[0].hash}&imdb=${this.imdb}&quality=${data.data.movie[0].items[0].quality}`;
      axios
      .get(`http://localhost:3000/subtitles?imdb=${imdb}`)
      .then(data => {
        let tmp = [];
        for (let index = 0; index < data.data.data[0].length; index++) {
          const element = data.data.data[0][index];
          if (element.lang == "english" && this.lang == 0)
          {
            tmp.push({
              uniqueId: index,
              lang: element.lang,
              file: `http://localhost:3000/sub/${element.fileName}`,
              default: true
            });            
          }
          else if (element.lang == "french" && this.lang == 1)
          {
            tmp.push({
              uniqueId: index,
              lang: element.lang,
              file: `http://localhost:3000/sub/${element.fileName}`,
              default: true
            });            
          }
          else if (element.lang == "arabic" && this.lang == 2)
          {
            tmp.push({
              uniqueId: index,
              lang: element.lang,
              file: `http://localhost:3000/sub/${element.fileName}`,
              default: true
            });            
          }
          else
          {
            tmp.push({
              uniqueId: index,
              lang: element.lang,
              file: `http://localhost:3000/sub/${element.fileName}`,
              default: false
            });
          }
        }
        this.items = tmp;
        let player = this.$refs["player"];
        player.src = this.src;
      });
//////////////// Stream ////////////////
      axios.get(`${this.src}`)
      .then(data => {})
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  },
  methods: {
//////////////// Stream ////////////////
    ft_stream: async function(quality, hash) {
      var token = this.$cookies.get('token');
      let obj = {};
      obj.imdb = this.imdb;
      obj.hash = hash;
      obj.title = this.Title
      axios.get(`http://localhost:3000/stream?hash=${hash}&imdb=${this.imdb}&quality=${quality}`)
      .then(data => {})
      .catch(err => console.log(err));
      let player = this.$refs["player"]
      player.pause();
      player.src = this.src;
      player.play();
      axios({
            method: 'post',
            url: 'http://localhost:3000/watch',
            data: obj,
            headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(data => {})
      .catch(err => console.log(err));
    },
//////////////// Comment ////////////////
    ft_comment: async function() {
      var token = this.$cookies.get('token');
      let obj = {};
      obj.imdb = this.imdb;
      obj.value = this.comment;
      axios({
            method: 'post',
            url: 'http://localhost:3000/comment',
            data: obj,
            headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(data => {})
      .catch(err => console.log(err));
    },
  }
};
</script>