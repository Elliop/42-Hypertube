<template>
  <v-app>
    <Navbar />
    <Background />
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import Background from "@/components/website/Background";
import jwt_decode from 'jwt-decode';
import axios from "axios";
export default {
  components: { Navbar, Footer, Background },
  data() {
    return {}
  },
  mounted() {
    var token = this.$cookies.get('token');
    axios({
          method: 'post',
          url: 'http://localhost:3000/jwt/',
          headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
          if (response.data == false)
            this.$router.push("/");
          else
            this.$router.push("/profile");
      })
      .catch(error => {
          console.log(error);
      });
  },
};
</script>
