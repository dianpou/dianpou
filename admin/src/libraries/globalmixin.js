module.exports = {
    image: function (obj, path) {
        return _.get(obj, path, 'holder.js/256x256?text=No image');
    },
    linkStateDeep: function (k) {
        // console.log(this.state, k, _.get(this.state, k));
        return {
            value: _.get(this.state, k),
            requestChange: (v) => {
                this.setState(_.set(this.state, k, v));
            }
        }
    }
};