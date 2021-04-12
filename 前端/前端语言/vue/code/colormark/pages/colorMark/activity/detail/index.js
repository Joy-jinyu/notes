export default {
    name: 'ActivityDetail',
    data() {
        return {}
    },
    methods: {
        handleSelect() {},
        vnodeIndex(index) {
            return `${index}`
        },
        vnodeKey(name, index) {
            return name + index++
        }
    }
}
