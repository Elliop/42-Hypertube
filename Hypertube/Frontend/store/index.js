export const state = () => ({
  Id: "",
  Imdb: "",
  Img: "",
});

export const mutations = {
  setId(state, id) {
    state.Id = id;
  },
  setImdb(state, imdb) {
    state.Imdb = imdb;
  },
  setImg(state, img) {
    state.Img = img;
  },
};
