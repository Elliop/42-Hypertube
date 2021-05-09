<template>
  <v-col>
    <!-- Snack Bar -->
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}
          <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    <v-row>
      <v-col>
        <v-row align="center" justify="center">
          <v-avatar size="250" class="pink darken-3 mt-6" align="center" justify="center">
            <img :src="path" />
          </v-avatar>
        </v-row>
        <v-card class="px-5" color="accent">
          <v-form v-model="valid">
            <v-row class="mt-10 pb-3" cols="12" xs="6" sm="8" md="6" lg="6" xl="6">
              <v-col>
                <v-file-input :rules="rules" v-model="image" accept="image/png, image/jpeg, image/jpg"
                    placeholder="Pick an avatar" prepend-icon="mdi-camera" label="Avatar">
                </v-file-input>
              </v-col>
              <v-col>
                <v-btn style="float: right" outlined color="primary" class="mt-4" :disabled="!valid" @click="ft_pic">
                  <v-icon left>mdi-check-bold</v-icon>SAVE
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import axios from "axios";
import jwt_decode from 'jwt-decode';
export default {
  data: () => ({
        snackbar: false,
        timeout: 8000,
        text: '',
    valid: true,
    image: [],
    rules: [
      value => !!value || 'Avatar is required',
      value => !value || value.size < 2000000 || "Image size should be less than 2 MB!"
    ],
    ///// Default /////
    FirstName: "",
    LastName: "",
    Username: "",
    Password: "",
    Email: "",
    path: "",
    vl: "",
  }),
  methods: {
    ft_pic: async function() {
      const respons = await this.pic_req();
      if (respons.res)
      {
        this.text = "Profile Picture Updated!"
        this.snackbar = true;                
      }
      else
      {
        this.text = "Invalid Picture!"
        this.snackbar = true;
      }
    },
    pic_req: async function() {
      var token = this.$cookies.get('token');
      const formData = new FormData();
      formData.append('firstname', this.FirstName);
      formData.append('lastname', this.LastName);
      formData.append('username', this.Username);
      formData.append('email', this.Email);
      formData.append('picture', this.image);
      formData.append('password', "");
      formData.append('language', this.vl);
      return axios({
        method: 'put',
        url: `http://localhost:3000/user/`,
        data: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then((res) => {
        this.$cookies.set('token', res.data.data[0].token, {})
        return { res }
      })
      .catch(function(err) {
        return { err }
      })
    },
  },
  mounted() {
    var token = this.$cookies.get('token');
    var decoded = jwt_decode(token);
    axios({
      method: 'get',
      url: `http://localhost:3000/user/${decoded.username}`,
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((res) => {
      this.FirstName = res.data.data[0].firstname;
      this.LastName = res.data.data[0].lastname;
      this.Username = res.data.data[0].username;
      this.Email = res.data.data[0].email;
      this.vl = res.data.data[0].language;
      if (res.data.data[0].picture)
        this.path = `http://localhost:3000/img/${res.data.data[0].picture}`;
      else
        this.path = `https://image.flaticon.com/icons/svg/149/149071.svg`;
    })
    .catch(function(err) {
      return { err }
    })
  },
};
</script>