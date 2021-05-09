<template>
  <v-row style="margin: 1vh">
    <histo />
  </v-row>
</template>

<script>
import histo from "@/components/app/history/histo";
import axios from "axios";
export default {
  layout: "app",
  components: { histo },
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
            this.$router.push("/history");
      })
      .catch(error => {
          console.log(error);
      });
  },
};
</script>