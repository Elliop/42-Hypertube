<template>
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
              <span class="font-weight-black display-1">{{ Title }} ({{ Year }})</span>
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
          </v-col>
        </v-row>
        <v-col align="center" justify="center">
          <v-btn width="50%" @click="ft_watch">Watch Now</v-btn>
        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  props: {
    contextId: String,
    contextImdb: String,
    contextImg: String,
  },
  data() {
    return {
      dialog: false,
      id: 0,
      imdb: 0,
      img: "",
      Title: "",
      Description: "",
      Year: 1999,
      Gender: [],
      Pic: "",
      Rating: 8,
      snackbar: false,
      timeout: 8000,
      text: "text",
      dialog_user: false,
      api: "",
      /////////////////////////////
    };
  },
  watch: {
    contextId: function(newId) {
      if (newId == this.id)
       return ;
      this.id = newId;
    },
    contextImdb: function(newImdb) {
      if (newImdb == this.imdb)
       return ;
      this.imdb = newImdb
    },
    contextImg: function(newImg) {
      if (newImg == this.img)
       return ;
      this.img = newImg
      this.ft_user(this.id, this.imdb, this.img);
    }
  },
  methods: {
    ft_user: async function(id, imdb, img) {
      const respons = await this.user_req(id, imdb, img);
    },
    user_req: async function(id, imdb, img) {
      let obj = {};
      obj.id = id
      obj.imdb = imdb
       obj.img = img
      await axios
      .post("http://localhost:3000/imdb", obj)
      .then(data => {
          this.id = data.data.movie[0].id;
          this.Title = data.data.movie[0].title;
          this.Description = data.data.movie[0].description;
          this.Year = data.data.movie[0].year;
          this.Gender = data.data.movie[0].genres;
          this.Pic = data.data.movie[0].big_image;
          this.Rating = data.data.movie[0].rating;
          this.api = data.data.movie[0].api;
      })
      .catch(err => console.log(err));
    },
    ft_watch: async function() {
      this.$cookies.set('imdb', this.imdb, {})
      this.$cookies.set('id', `${this.id}.`, {})
      this.$cookies.set('img', this.img, {})
      this.$router.push('/watch');
    },
  }
};
</script>