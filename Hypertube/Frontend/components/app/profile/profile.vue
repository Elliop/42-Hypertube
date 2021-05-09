<template>
  <v-col>
    <v-row>
      <v-form v-model="valid">
        <v-row>
          <v-text-field label="Search" outlined class="mx-3" v-model="userName" :rules="nameRules"></v-text-field>
          <v-btn @click="ft_user" :disabled="!valid" color="primary" class="mt-2"><v-icon>mdi-send</v-icon></v-btn>            
        </v-row>
      </v-form>
    </v-row>
    <v-row>
      <v-col>
          <v-row align="center" justify="center">
            <v-avatar size="250" class="pink darken-3 mt-6" align="center" justify="center">
              <img :src="Pic" />
            </v-avatar>
          </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
          <v-card class="mx-10 my-5" color="accent">
              <v-card-title>
                  <v-icon color="primary" class="mr-5">mdi-account-child</v-icon>
                  First Name: {{FirstName}}
              </v-card-title>
          </v-card>
      </v-col>
      <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
          <v-card class="mx-10 my-5" color="accent">
              <v-card-title>
                  <v-icon color="primary" class="mr-5">mdi-account-child-circle</v-icon>
                  Last Name: {{LastName}}
              </v-card-title>
          </v-card>
      </v-col>
      <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
          <v-card class="mx-10 my-5" color="accent">
              <v-card-title>
                  <v-icon color="primary" class="mr-5">mdi-account-convert</v-icon>
                  Username: {{Username}}
              </v-card-title>
          </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import axios from "axios";
import jwt_decode from 'jwt-decode';
export default {
  data() {
    return {
        FirstName: "",
        LastName: "",
        Username: "",
        Pic: "",
        valid: true,
        nameRules: [ v => !!v || 'Name is required', ],
        userName: "",
    };
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
        if (res.data.data[0].picture)
          this.Pic = `http://localhost:3000/img/${res.data.data[0].picture}`;
        else
          this.Pic = `https://image.flaticon.com/icons/svg/149/149071.svg`;
    })
    .catch(function(err) {
        return { err }
    })
  },
  methods: {
    ft_user: async function() {
      var token = this.$cookies.get('token');
      axios({
            method: 'get',
            url: `http://localhost:3000/user/${this.userName}`,
            headers: { 'Authorization': `Bearer ${token}` }
        })
      .then((res) => {
          this.FirstName = res.data.data[0].firstname;
          this.LastName = res.data.data[0].lastname;
          this.Username = res.data.data[0].username;
          this.Pic = `http://localhost:3000/img/${res.data.data[0].picture}`; 
      })
      .catch(function(err) {
          return { err }
      })
    },
  }
};
</script>