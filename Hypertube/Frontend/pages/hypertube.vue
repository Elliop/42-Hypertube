<template>
  <v-row style="margin: 6vh 1vh 0 1vh">
    <v-col>
      <hyper />
    </v-col>
  </v-row>
</template>

<script>
import hyper from "@/components/app/lib/hyper";
import axios from "axios";
export default {
  layout: "app",
  components: { hyper },
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
            this.$router.push("/hypertube");
      })
      .catch(error => {
          console.log(error);
      });
  },
};
</script>