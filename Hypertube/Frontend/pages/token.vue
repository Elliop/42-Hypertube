<template>
  <v-app>
    <Navbar />
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="green" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
    <Background />
    <Footer />
  </v-app>
</template>

<script>
import axios from "axios";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import Background from "@/components/website/Background";

export default {
  components: { Navbar, Footer, Background },
  data: () => ({
    snackbar: false,
    timeout: 8000,
    text: '',
  }),
  asyncData (ctx) {
    const activationCode = ctx.route.query.activationCode;
    let obj = {};
    obj.activationCode = activationCode;
    return axios.put('http://localhost:3000/activate', obj)
        .then((res) => {
            return {
                    snackbar: true,
                    text: res.data.alert[0],
                    timeout: 8000,
                    }
        })
        .catch(err => console.log(err));
    },
    mounted() {
        var token = this.$cookies.get('token');
        axios({
            method: 'post',
            url: 'http://localhost:3000/jwt/',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (response.data == true)
                this.$router.push("/profile");
        })
        .catch(error => {
            console.log(error);
        });
    },
  }
</script>