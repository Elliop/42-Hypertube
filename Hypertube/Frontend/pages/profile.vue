<template>
  <v-row>
    <profile />
  </v-row>
</template>

<script>
import profile from "@/components/app/profile/profile";
import axios from "axios";
export default {
  layout: "app",
  components: { profile },
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