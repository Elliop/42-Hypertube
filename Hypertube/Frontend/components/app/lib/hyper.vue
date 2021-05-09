<template>
  <v-col>
    <v-row>
      <v-col>
        <v-form v-model="valid1">
          <v-row>
            <v-text-field label="Search by name" outlined class="mx-3" v-model="movieName" :rules="nameRules"></v-text-field>
            <v-btn @click="ft_name" :disabled="!valid1" color="primary" class="mt-2"><v-icon>mdi-send</v-icon></v-btn>            
          </v-row>
        </v-form>
      </v-col>
      <v-col>

          <template>
            <div class="text-center">
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn dark v-on="on">
                    Genders
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(item, index) in btns" :key="index">
                    <v-list-item-title @click="() => ft_gender(item.title)">{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>

      </v-col>
    </v-row>
    <v-card color="accent" height="70%" width="100%">
          <div class="text-center">
            <v-snackbar v-model="snackbar" :timeout="timeout">
              {{ text }}
              <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </div>
          <v-row>
            <v-col align="center"><v-btn @click="sortBy('title')">Name</v-btn></v-col>
            <v-col align="center"><v-btn @click="sortBy('rating')">Rating</v-btn></v-col>
            <v-col align="center"><v-btn @click="sortBy('year')">Date</v-btn></v-col>
          </v-row>
      <v-row>


        <v-col v-for="item in items" :key="item.uniqueId" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
          <v-card style="margin: 1vh">
            <center>
              <v-img :src="item.pic" @click="() => ft_user(item.id, item.imdb, item.pic)"></v-img>
            </center>
            <v-row align="center" justify="center" class="my-5">
              <span>{{ item.title }} ({{ item.year }})</span>
            </v-row>
            <v-row align="center" justify="center" class="my-5">
              <v-rating background-color="yellow accent-4" color="yellow accent-4" v-model="item.rating" length="10" half-increments hover readonly size="12" dense></v-rating>
              <span class="mx-1 yellow--text">({{ item.rating }})</span>
            </v-row>
          </v-card>
        </v-col>


        <v-dialog max-width="750px" eager v-model="dialog_user">
          <movie :contextId="contextId" :contextImdb="contextImdb" :contextImg="contextImg" />
        </v-dialog>
      </v-row>
    </v-card>
    <v-row class="mt-5">
        <v-btn :disabled="!btnBack" @click="ft_back"><v-icon>mdi-arrow-left</v-icon>Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn :disabled="!btnNext" @click="ft_next">Next<v-icon>mdi-arrow-right</v-icon></v-btn>
    </v-row>
  </v-col>
</template>

<script>
import movie from "./movie";
import axios from "axios";
export default {
  components: { movie },
  data() {
    return {
      btns: [
        { title: 'Drama' },
        { title: 'Horror' },
        { title: 'Adventure' },
        { title: 'Musical' },
        { title: 'History' },
        { title: 'Action' },
        { title: 'Comedy' },
        { title: 'Romance' },
        { title: 'Family' },
        { title: 'Animation' },
      ],
      nameRules: [ v => !!v || 'Name is required', ],
      genderRules: [ v => !!v || 'Gender is required', ],
      items: [],
      sort: true,
      contextId: null,
      contextImdb: null,
      contextImg: null,
      snackbar: false,
      dialog_user: false,
      valid1: true,
      valid2: true,
      btnNext: true,
      btnBack: true,
      text: "",
      movieName: "",
      movieGender: "",
      timeout: 8000,
      Pagination: "library",
      i: 1,
    };
  },
//////////////////////// MOUNTED //////////////////////////////
  mounted() {
    let obj = {};
    this.i = 1
    obj.page = this.i
    obj.sortBy = "title"
    axios
      .post("http://localhost:3000/library", obj)
      .then(data => {
        let tmp = [];
        for (let index = 0; index < data.data.movie.length; index++) {
          const element = data.data.movie[index];
          tmp.push({
            uniqueId: index,
            pic: element.big_image,
            id: element.id,
            imdb: element.imdb,
            title: element.title,
            rating: element.rating,
            year: element.year,
            api: element.api,
          });
        }
        this.items = tmp;
      })
      .catch(err => console.log(err));
  },
  methods: {
//////////////////////// SORT //////////////////////////////
    sortBy(prop) {
      this.sort = !this.sort;
      if (this.sort == true)
        this.items.sort((a, b) => a[prop] < b[prop] ? -1 : 1)
      else
        this.items.sort((a, b) => a[prop] < b[prop] ? 1 : -1)
    },
//////////////////////// NEXT //////////////////////////////
    ft_next: async function() {
      this.i++;
      let obj = {};
      if (this.Pagination == "gender")
        obj.gender = this.movieGender
      obj.page = this.i
      obj.sortBy = "title"
      axios
      .post(`http://localhost:3000/${this.Pagination}`, obj)
      .then(data => {
          let tmp = [];
        for (let index = 0; index < data.data.movie.length; index++) {
          const element = data.data.movie[index];
          tmp.push({
              uniqueId: index,
              pic: element.big_image,
              id: element.id,
              imdb: element.imdb,
              title: element.title,
              rating: element.rating,
              year: element.year,
              api: element.api,
            });
          }
          this.items = tmp;
      })
      .catch(err => console.log(err));
    },
//////////////////////// BACK //////////////////////////////
    ft_back: async function() {
      if (this.i <= 1)
          this.i = 1
      else
          this.i--;
      let obj = {};
      if (this.Pagination == "gender")
        obj.gender = this.movieGender
      obj.page = this.i
      obj.sortBy = "title"
      axios
      .post(`http://localhost:3000/${this.Pagination}`, obj)
      .then(data => {
          let tmp = [];
        for (let index = 0; index < data.data.movie.length; index++) {
          const element = data.data.movie[index];
          tmp.push({
            uniqueId: index,
            pic: element.big_image,
            id: element.id,
            imdb: element.imdb,
            title: element.title,
            rating: element.rating,
            year: element.year,
            api: element.api,
          });
          }
          this.items = tmp;
      })
      .catch(err => console.log(err));
    },
//////////////////////// TITLE //////////////////////////////
    ft_name: async function() {
      let obj = {};
      obj.page = 1
      obj.title = this.movieName
      obj.sortBy = "title"
      this.btnNext = false
      this.btnBack = false
      axios
      .post("http://localhost:3000/movies", obj)
      .then(data => {     
          let tmp = [];
        for (let index = 0; index < data.data.movie.length; index++) {
          const element = data.data.movie[index];
          tmp.push({
            uniqueId: index,
            pic: element.big_image,
            id: element.id,
            imdb: element.imdb,
            title: element.title,
            rating: element.rating,
            year: element.year,
            api: element.api,
          });
          }
          this.items = tmp;
      })
      .catch(err => console.log(err));
    },
//////////////////////// GENDER //////////////////////////////
    ft_gender: async function(gender) {
      this.btnNext = true
      this.btnBack = true
      this.movieGender = gender
      this.Pagination = 'gender';
      this.i = 1;
      let obj = {};
      obj.page = this.i
      obj.gender = gender
      obj.sortBy = "title"
      axios
        .post(`http://localhost:3000/${this.Pagination}`, obj)
        .then(data => {
          let tmp = [];
        for (let index = 0; index < data.data.movie.length; index++) {
          const element = data.data.movie[index];
            tmp.push({
              uniqueId: index,
              pic: element.big_image,
              id: element.id,
              imdb: element.imdb,
              title: element.title,
              rating: element.rating,
              year: element.year,
              api: element.api,
            });
          }
          this.items = tmp;
        })
        .catch(err => console.log(err));
    },
//////////////////////// UNIQUE USER //////////////////////////////
    ft_user: async function(id, imdb, img) {
      this.dialog_user = true; 
      this.contextId = id;
      this.contextImdb = imdb;
      this.contextImg = img;
    },
  }
};
</script>